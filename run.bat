python Automation.py
sleep 5
cd Mapbox
start python -m http.server
sleep 2s
start chrome http:localhost:8000 --incognito