from django.core.management.utils import get_random_secret_key

def create_env():
    with open(".env", "w") as env:
        env.write(f'SECRET_KEY={get_random_secret_key()}')
