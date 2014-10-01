from flask import Flask
from flask import session,url_for,request,redirect,render_template
from pymongo import MongoClient

import utils
db = MongoClient().db

app = Flask(__name__)
app.secret_key = 'maroon5'


def autherizer (dirc):
        def outerWrapper (func):
                print "authorizing"
                def wrapper ():
                        print "running wrapper"
                        if 'username' in session:
                                print 'user in session'
                                return func ()
                        else:
                                print 'you must login'
                                session['oldPage'] = dirc
                                return redirect(url_for('login'))
                return wrapper
        print 'returning wrapper'
        return outerWrapper

@app.route("/")
@autherizer ("/")
def home():
        return "You have reached the Home Page"

@app.route("/register",methods = ["GET","POST"])
def register():
        if request.method=="GET":
                return render_template("register.html")
        else:
                button = request.form['button']
                if button == "Submit":
                        username = request.form['username'].encode ('ascii',"ignore")
                        password = request.form['password'].encode ('ascii',"ignore")
                        if not utils.auth(username,password,db.login):
                                utils.addUser(username,password,db.login)
                                return redirect("/login")
                        else:
                                return "You already have an account"

@app.route("/login",methods=['GET','POST'])
def login():
        if request.method=="GET":
                return render_template("login.html")
        else:
                button = request.form['button']
                if button == 'Submit':
                        username = request.form['username'].encode ('ascii',"ignore")
                        password = request.form['password'].encode ('ascii',"ignore")
                        if utils.auth(username,password,db.login):
                                print "logged in!"
                                session['username'] = username
                                if 'oldPage' in session:
                                        return redirect (session['oldPage'])
                                else:
                                        return "You have logged in"
                        else:
                                return redirect ("/login")
                                print 'login attempt failed. Try again.'

@app.route("/logout")
def logout():
        session.pop('username',None)
        return redirect(url_for("register"))

if __name__=="__main__":
        app.debug=True
        app.run(host='0.0.0.0',port=5000)


