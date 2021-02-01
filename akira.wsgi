#akira.wsgi
import sys
sys.path.insert(0, '/var/www/html/akira')

from app import app as application
