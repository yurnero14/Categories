# Categories: Dare to play?
## Muhammad Sarib Khan

## React Client Application Routes

- Route `index`: Main layout is here with round creation form
- Route `/*`: Not found layout is here
- Route `/responseForm`: Answer form and timer is displayed here
- Route `/myScore`: user's score is rendered here
- Route `/hof`: Hall of fame is rendered here
- Route `/`: Category default layout is here
- ...

## API Server

- POST `/api/login`
  - request parameters and request body content: no request parameters, email and password in request body
  - response body content: email 
  https://imgur.com/a/C3mBbL8
- GET `/api/sessions/current`
  - request parameters: no request parameters
  - response body content: email, name, id 
  https://imgur.com/a/9jIkRVf
- POST `/api/RoundAndResponse`
  - request parameters and request body content: no request parameters, request body: category, difficulty
  - response body content: id, cat_Id, letter, difficulty, StartTime, resp_Id, user_id
  https://imgur.com/a/c99KLJI
- PUT `/api/answer/:respId` 
  - request parameters: respId
  - request body: answers
  - response body: answers, score
  https://imgur.com/a/JjOpdLz
- GET `/api/score` 
  - request parameters and request body: no content 
  - response body: score of each category for user
  https://imgur.com/a/UstKcAh
- GET `/api/hallofFame` 
  - request parameters and request body: no content 
  - response body: hall of famer of each category with score 
  https://imgur.com/a/Emc4DJH
- DELETE `/api/sessions/current`
  - no request body or parameters

## Database Tables

- Table `users` - contains email, name, hash, salt
- Table `Categories` - contains Category name
- Table `Category_Data` - contains cat_Id, category_data for correct answers
- Table `rounds` - contains cat_Id, letter, difficulty, StartTime
- Table `Responses`- contains user_id, round_id, answers, score


## Main React Components

- `CreateRoundForm` (in `CreateRound.js`): To start a round
- `LoginForm` (in `AuthComponents.js`): To login 
- `ReponseForm` (in `ResponseForm.js`): to record answers


## Screenshot
login:https://imgur.com/a/5zVbmJL
main: https://imgur.com/a/4F1HyE6
response form: https://imgur.com/a/65z4CGl
myscore: https://imgur.com/a/TM2QtkU
hall of fame: https://imgur.com/a/kDkQLii
## Users Credentials

|usernames|Password|
|------------------------|---------------|
|john.doe@polito.it      |webapplication3|
|mario.rossi@polito.it   |webapplication3|
|artour.khan@polito.it   |webapplication3|
|lewis.hamilton@polito.it|webapplication3|
|kylian.mbappe@polito.it |webapplication3|
|guest@polito.it         |webapplication3|
