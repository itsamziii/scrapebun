from dotenv import load_dotenv
from server import run_server

load_dotenv()

app = run_server()
