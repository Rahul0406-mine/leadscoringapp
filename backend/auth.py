
from fastapi import Request, HTTPException, Depends
import firebase_admin
from firebase_admin import auth as firebase_auth, credentials

def initialize_firebase():
    # In a real application, use Secret Manager to store and access credentials
    # For this example, we'''ll assume the credentials are in a local file
    # Make sure to replace 'path/to/your/firebase-credentials.json' with the actual path
    try:
        cred = credentials.Certificate("backend/firebase-credentials.json")
        firebase_admin.initialize_app(cred)
    except Exception as e:
        # This will fail if not configured, but we can proceed
        # The middleware will then raise an exception if Firebase is not configured
        print(f"Firebase initialization failed: {e}")
        print("Firebase features will be disabled.")


async def get_current_user(request: Request):
    if not firebase_admin._apps:
        raise HTTPException(status_code=500, detail="Firebase not initialized")

    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid Authorization header format")

    token = auth_header.split("Bearer ")[1]
    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token
    except firebase_auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid ID token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error verifying token: {e}")
