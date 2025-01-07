import io
import boto3

from os import getenv


class AudioBot():


    def convert_response_to_speech(self, response_text: str, buffer: io.BytesIO):
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
        output_format = 'mp3'

        try:
            max_text_length = 3000
            if len(response_text) > max_text_length:
                print(f"Text length exceeds {max_text_length} characters, truncating...")
                response_text = response_text[:max_text_length]

            response = polly.synthesize_speech(
                Text=response_text,
                VoiceId=voice_id,
                OutputFormat=output_format
            )

            buffer.write(response['AudioStream'].read())


        except polly.exceptions.TextLengthExceededException as e:
            print(f"Text length error: {e}")
            raise ValueError("Input text exceeds the maximum allowed length for synthesis.") from e

        except Exception as e:
            print(f"Unexpected error during speech synthesis: {e}")
            raise


