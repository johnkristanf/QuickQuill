from fastapi import HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from jose import JWTError, jwt
import os


class JWTMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        authorization: str = request.headers.get('Authorization')
        if authorization is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authorization header missing")
        
        parts = authorization.split()
        
        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Authorization header must be Bearer token"
            )
        
        try:
            token = parts[1]
            payload = self.decode_jwt(token)  
            request.state.user = payload

        except JWTError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
        
        response = await call_next(request)
        return response
    

    def decode_jwt(self, token: str):

        SECRET_KEY = os.getenv("JWT_SECRET")
        ALGORITHM = "HS256"

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload  
        except JWTError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

            