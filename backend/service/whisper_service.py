import os
import tempfile
from groq import Groq

class TranscribeService:
    def __init__(self):
        self.client = Groq(
            api_key=os.environ.get("GROQ_API_KEY")
        )
        self.voice_model = "whisper-large-v3"

    def transcribe(self, file_bytes: bytes) -> str:
        temp_path = None
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp:
                temp.write(file_bytes)
                temp_path = temp.name

            with open(temp_path, "rb") as f:
                transcription = self.client.audio.transcriptions.create(
                    file=("voice.webm", f.read()),
                    model=self.voice_model,
                    language="en",   # or "vi"
                    response_format="json"
                )

            return transcription.text.strip()

        except Exception as e:
            print(f"Groq STT Error: {e}")
            return ""

        finally:
            if temp_path and os.path.exists(temp_path):
                os.remove(temp_path)

