from db import *

#Checking if user1 and user2 are associated by friend requests or are friends
def check_association(user1, user2):
    friends = get_all_friends(user1)
    requests = get_all_friend_requests(user1)
    for friend in friends:
        if ( (user2 == friend[0]) or (user2 == friend[1])):
            return True
    for request in requests:
        if ( (user2 == request[0]) ):
            return True
        if ((user2 == request[1])):
            return True
    return False

#Returns users that are not associated based on search input in 2D ARRAY [[username, profile_picture],...]
def search_new_friends(search_term, username):
    data = get_all_users()
    searched = []
    for user in data:
        if ( ( not check_association(username, user[0]) ) and ( search_term.lower() in user[0].lower() )):
            searched.append(user)
    return searched

#Returns friends based on search input in 2D ARRAY [[username, profile_picture],...]
def search_friends(search_term, username):
    data = get_all_friends(username)
    searched = []
    for friend in data:
        if (username != friend[0]):
            if (( search_term.lower() in friend[0].lower() )):
                searched.append([friend[0], get_user(friend[0])[2]])
        else:
            if (( search_term.lower() in friend[1].lower() )):
                searched.append([friend[1], get_user(friend[1])[2]])
    return searched

#Returns friend requests based on search input in 2D ARRAY [[username, profile_picture],...]
def search_friend_requests(search_term, username):
    data = get_all_friend_requests(username)
    searched = []
    for request in data:
        if (username != request[0]):
            if (( search_term.lower() in request[0].lower() )):
                searched.append([request[0], get_user(request[0])[2]])
    return searched