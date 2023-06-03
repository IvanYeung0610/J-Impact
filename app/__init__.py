from flask import Flask, render_template, session, request, redirect, url_for
from db import *

app = Flask(__name__)
app.secret_key = "temp"

@app.route("/", methods=["GET", "POST"])
def home_page():
    if(session.get("CLIENT", None) != None and get_user(session.get("CLIENT")) != None):
        return render_template("home.html")
    return redirect( url_for("login_page") )

@app.route("/login", methods=["GET", "POST"])
def login_page():
    if ( request.method == "GET" ):
        return render_template("login.html")
    username = request.form.get("username")
    password = request.form.get("password")
    print("REACHED")
    if(match_account_info(username,password)):
        print("MATCHED")
        session["CLIENT"] = username
        return redirect( url_for("home_page") )
    return render_template("login.html")

@app.route("/register", methods=["GET", "POST"])
def register_page():
    if ( request.method == "GET" ):
        return render_template("registration.html")
    username = request.form.get("username")
    password = request.form.get("password")
    if(add_user(username,password)):
        return redirect( url_for("login_page") )
    return render_template("registration.html") # FAILED, username exists

@app.route("/logout", methods=["GET"])
def logout():
    session.pop("CLIENT")
    return redirect( url_for("login_page") )

if __name__ == "__main__":
    app.debug = True
    app.run(host='0.0.0.0')
