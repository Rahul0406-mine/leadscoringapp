
from fastapi import Request, HTTPException, Depends
import firebase_admin
from firebase_admin import auth as firebase_auth, credentials
import os


def initialize_firebase():
	# Initialize only once
	if firebase_admin._apps:
		return

	# Prefer env-based credentials; fallback to local file
	project_id = os.getenv("FIREBASE_PROJECT_ID")
	private_key_id = os.getenv("FIREBASE_PRIVATE_KEY_ID")
	private_key = os.getenv("FIREBASE_PRIVATE_KEY")
	client_email = os.getenv("FIREBASE_CLIENT_EMAIL")
	client_id = os.getenv("FIREBASE_CLIENT_ID")
	auth_uri = os.getenv("FIREBASE_AUTH_URI")
	token_uri = os.getenv("FIREBASE_TOKEN_URI")
	auth_provider_x509_cert_url = os.getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL")
	client_x509_cert_url = os.getenv("FIREBASE_CLIENT_X509_CERT_URL")

	try:
		if project_id and private_key and client_email:
			cred_dict = {
				"type": "service_account",
				"project_id": project_id,
				"private_key_id": private_key_id,
				"private_key": private_key.replace("\\n", "\n"),
				"client_email": client_email,
				"client_id": client_id,
				"auth_uri": auth_uri,
				"token_uri": token_uri,
				"auth_provider_x509_cert_url": auth_provider_x509_cert_url,
				"client_x509_cert_url": client_x509_cert_url,
			}
			cred = credentials.Certificate(cred_dict)
		else:
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
