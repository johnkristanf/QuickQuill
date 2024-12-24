import unittest
from unittest.mock import patch, Mock
from generative.chatbot import ChatBotLLAMA

class TestChatBotFunction(unittest.TestCase):
    @patch("generative.chatbot.InferenceClient")  # Patch the InferenceClient where it's used
    def test_message_api_chatbot_success(self, mock_inference_client):
        # Arrange
        mock_response = Mock()
        mock_response.choices = [Mock(message={"content": "Hello, I am ChatBotLLAMA!"})]
        
        mock_client_instance = Mock()
        mock_client_instance.chat.completions.create.return_value = mock_response
        mock_inference_client.return_value = mock_client_instance

        chatbot = ChatBotLLAMA()
        message = "Hello, chatbot!"

        # Act
        response = chatbot.message_api_chatBot(message)

        # Assert
        self.assertEqual(response, "Hello, I am ChatBotLLAMA!")
        mock_client_instance.chat.completions.create.assert_called_once_with(
            model="meta-llama/Llama-3.2-3B-Instruct",
            messages=[{"role": "user", "content": "Hello, chatbot!"}],
            temperature=0.5,
            max_tokens=2048,
            top_p=0.7,
        )


    @patch("generative.chatbot.InferenceClient")
    def test_chatbot_error_response(self, mock_inference_client):
        mock_client_instance = Mock()
        mock_client_instance.chat.completions.create.side_effect = Exception("Simulated API error"),
        mock_inference_client.return_value = mock_client_instance

        chatbot = ChatBotLLAMA()
        message = "Hello, chatbot!"

        with self.assertRaises(Exception) as ctx1:
            chatbot.message_api_chatBot(message)
        self.assertEqual(str(ctx1.exception), "An unexpected error occurred: Simulated API error")

        mock_client_instance.chat.completions.create.assert_called_with(
            model="meta-llama/Llama-3.2-3B-Instruct",
            messages=[{"role": "user", "content": "Hello, chatbot!"}],
            temperature=0.5,
            max_tokens=2048,
            top_p=0.7,
        )

        
        

if __name__ == "__main__":
    unittest.main()