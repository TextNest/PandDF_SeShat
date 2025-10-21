from langchain.embeddings import OpenAIEmbeddings
class path:
    FAISS_INDEX_PATH = "data/faiss_index"
    DOCSTORE_PATH = "data/docstore.pkl"
    IMAGE_STORE_PATH = "data/image_store.pkl"
    PAGE_IMAGES_DIR = "data/page_images"

class load:
    def __init__(self):
        pass

    def envs():
        from dotenv import load_dotenv
        import os  
        load_dotenv()
        os.environ["OPENAI_API_KEY"] = os.getenv("openai")
        
        






