// ######## USER
//ev lägga till förnamn, efternamn, födelseår, url, register_date,
[{
  "_id": ObjectId('mfeaior394j29342843'),
  "user_name": 'coola_micke_73',
  "profile_picture": '/files/user/28394h82.img',
  "email": 'micke@micke.se',
  "password": 'hemligt123',
  "is_online": false //gör find på alla där is_online: true
}]

// ######## CHAT MESSAGES
//ev lägga till update_date, edited: true/false, mention: user_id
[{
  "_id": ObjectId('21344243'),
  "author": {"user_id": ObjectId('mfeaior394j29342843')},
  "message": "tjaba bloggen",
  "attachment": '/files/attachments/lol.gif', //eventuellt fs?
  "post_date": "2021-03-03 13:14:55"
}]

// ######## CHAT ROOM
//ev lägga till created_date
[{
  "_id": ObjectId('14234232b12314'),
  "users": [
    {"user_id": ObjectId('mfeaior394j29342843')},
    {"user_id": ObjectId('mfeai45353644342521')}
  ],
  "messages": [
    {"chat_message_id": ObjectId('21344243')},
    {"chat_message_id": ObjectId('21344555')}]
}]

// ######## CHANNEL MESSAGES
//ev lägga till update_date, edited: true/false, mention: user_id
[{
  "_id": ObjectId('2134674h4'),
  "author": {"user_id": ObjectId('mfeaior394j29342843')},
  "message": "tjaba gänget",
  "attachment": '/files/attachments/lol.gif', 
  "post_date": "2021-03-02 13:14:55"
}]

// ######## CHANNEL 
//ev lägga till created_date
[{
  "_id": ObjectId('23545342g25g35g32'),
  "channel_name": 'Backend1',
  "users": [
    {"user_id": ObjectId('mfeaior394j29342843')},
    {"user_id": ObjectId('mfeai45353644342521')},
    {"user_id": ObjectId('mfeaior394j29342555')},
    {"user_id": ObjectId('mfeai45353644347775')},
    {"user_id": ObjectId('mfeaior394j29342889')},
    {"user_id": ObjectId('mfeai45353644351511')},
  ],
  "admins": [
    {"user_id": ObjectId('mfeaior394j29342843')}
    ],
  "posts": [
    {"channel_message_id": ObjectId('2134674h4')}
  ]
}]