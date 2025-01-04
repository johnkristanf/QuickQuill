import boto3
import uuid
import asyncio
import requests

from os import getenv

class AudioBot():


    def upload_audio_s3(self, audio_data, file_name):
        audio_data.seek(0)
            
        aws_access_key = getenv("AWS_ACCESS_KEY_ID")
        aws_secret_key = getenv("AWS_SECRET_KEY")
        region_name = getenv("REGION_NAME")
        s3_bucket_name = "quickquill"

        s3_client = boto3.client(
            's3',
            aws_access_key_id=aws_access_key,
            aws_secret_access_key=aws_secret_key,
            region_name=region_name
        )

        s3_client.put_object(
            Bucket=s3_bucket_name,
            Key=file_name,
            Body=audio_data,
            ContentType='audio/webm' 
        )

    

    async def transcribe_audio(self, audio_uri):
        aws_access_key = getenv("AWS_ACCESS_KEY_ID")
        aws_secret_key = getenv("AWS_SECRET_KEY")
        region_name = getenv("REGION_NAME")

        transcribe = boto3.client(
            'transcribe',
            aws_access_key_id=aws_access_key,
            aws_secret_access_key=aws_secret_key,
            region_name=region_name
        )

        job_name = f"transcription-job-{uuid.uuid4()}"
        transcribe.start_transcription_job(
            TranscriptionJobName=job_name,
            Media={'MediaFileUri': audio_uri},
            MediaFormat='webm',
            LanguageCode='en-US'
        )


        while True:
            response = transcribe.get_transcription_job(TranscriptionJobName=job_name)
            status = response['TranscriptionJob']['TranscriptionJobStatus']
            if status in ['COMPLETED', 'FAILED']:
                break
            await asyncio.sleep(5)

        if status == 'COMPLETED':
            transcription_url = response['TranscriptionJob']['Transcript']['TranscriptFileUri']
            response = await asyncio.to_thread(self.fetch_transcription, transcription_url)
            return response['results']['transcripts'][0]['transcript']
        
        return None
            
    

    def fetch_transcription(self, transcript_file_uri):
        transcript_response = requests.get(transcript_file_uri)
        if transcript_response.status_code == 200:
            try:
                return transcript_response.json() 
            except ValueError as e:
                print(f"Error parsing transcription response: {e}")
                return None
        else:
            print(f"Failed to fetch transcription result: {transcript_response.status_code}")
            return None


    def convert_response_to_speech(self, response_text):
        aws_access_key = getenv("AWS_ACCESS_KEY_ID")
        aws_secret_key = getenv("AWS_SECRET_KEY")
        region_name = getenv("REGION_NAME")

        polly = boto3.client(
            'polly',
            aws_access_key_id=aws_access_key,
            aws_secret_access_key=aws_secret_key,
            region_name=region_name
        )

        voice_id = 'Joanna'
        output_format='mp3'
        speech_file_name='speech.mp3'

        response = polly.synthesize_speech(
            Text=response_text,
            VoiceId=voice_id,
            OutputFormat=output_format
        )

        with open(speech_file_name, 'wb') as file:
            file.write(response['AudioStream'].read())

        print(f"Speech saved to {speech_file_name}")

        return speech_file_name

