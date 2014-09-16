from flask import Flask

app = Flask (__name__)

@app.route ("/")
def home ():
    s = "<table>"
    data = open ("TSEV.csv", "r")
    data.readline()
    for line in data:
        s = s + "<tr>"
        t = line.split(',')
        for b in t:
            s = s + "<td>" + b + "</td>"
        s = s + "</tr>"
    s = s + "</table>"
    data.close()
    return s

if __name__ == "__main__":
    app.debug = True
    app.run()
