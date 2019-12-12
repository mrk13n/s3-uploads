# Instructions

> 

## Get up and running
1. You'll need local mongo database. Please donwnload and install MongoDB & Mongo Compass | [Mongo website](https://www.mongodb.com/)
2. Install dependencies
  ```
  cd path/to/feathersjs-s-3-uploads
  npm install
  ```
3. Start MongoDB locally. Depending on your setu up something like
  ```
  ~/mongodb/bin/mongod
  ```
4. Start FeathersJs server
  ```
  npm run dev
  ```
3. Open [Postman](https://www.getpostman.com/) and create user
  ```
  Content-Type: application/json
  METHOD: POST
  URL: 127.0.0.1:3030/users
  DATA: { strategy: 'local', email: 'some@email.com', password: 'pass'}
  ```
4. Login in [Postman](https://www.getpostman.com/)
  ```
  Content-Type: application/json
  METHOD: POST
  URL: 127.0.0.1:3030/authentication
  DATA: { strategy: 'local', email: 'some@email.com', password: 'pass'}
  ```
  You'll get `accessToken` in response. Keep it

5. Upload file (multipart/form-data)
  ** UPLOAD SMALL FILES **
  ```
  Content-Type: ** DO NOT SEND **
  Authorization: {{TOKEN FROM STEP 4}}
  METHOD: POST
  URL: 127.0.0.1:3030/user-files
  DATA: {
   file: {{SELECT SMALL FILE FROM POSTMAN FIELD}},
   access: {{'public' or 'private'}}
  }
  ```

6. Delete file(multipart/form-data)
  ```
    Content-Type: ** DO NOT SEND **
    Authorization: {{TOKEN FROM STEP 4}}
    METHOD: DELETE
    URL: 127.0.0.1:3030/user-files
    DATA: {
     _id: {{file id from database}}
    }
   ```

7. Login to AWS
  Go to https://cybergentic.signin.aws.amazon.com/console
  ```
  IAM user name: nazar
  Pssword: changeme
  ```
  You'll have full S3 access, please do not change anything except `s3uploads-test` bucket settings. You'll need to change `s3uploads-test` bucket settings in order to make it work as needed.




## What do you need to do
1. Add file privacy support: case when user is logged in and gets a link that shows picture from s3 and when logged out - image doesn't show up
2. Add multi file uploads



## Helpful links
You can look at sources or docs of [feathers-mongoose-casl](https://github.com/doronnahum/feathers-mongoose-casl#readme)
