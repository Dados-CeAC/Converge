import requests, time
urls=['http://127.0.0.1:5000/api/setores','http://127.0.0.1:5000/api/filiais']
for u in urls:
    for i in range(10):
        try:
            r=requests.get(u, timeout=2)
            print(u, 'status', r.status_code)
            print(r.text)
            break
        except Exception as e:
            time.sleep(1)
            if i==9:
                print(u, 'failed:', e)
