# ACIT 3695

##### Christian Malit
##### A00983372
&nbsp;&nbsp;
## 3695 - Finals Practical

&nbsp;&nbsp;

### Running the GraphQL Application
```
> npm install
> npm start
```
Access the site with this link: http://localhost:4000/graphql
&nbsp;

### Instructions
All mutations must be done **sequentially** first before any queries can be made. This is to fill the database with information, otherwise queries will have no result

#### 1. Boot up the Subscription Page
Load the following query in one of the tabs in GraphQL-Playground
```
subscription {
  newPost{
    post_id
    username
    topic
    comments
  }
}
```
Launch another tab by pressing the + in the tabs found in GraphQL-Playground
```
subscription {
  newComment{
    post_id
    comment_id
    username
    responses
  }
}
```
With this, subscriptions are now running and you will see feeds of new user inputs here.
&nbsp;&nbsp;
To create a post, you must use an existing **username**, the pre-existing users can be queried using the following:
```
query {
  users {
    user_id
    username
    name
  }
}
```
&nbsp;
##### 2. Sample Mutations to Create a new post
For this example, we will create a post using the alias **Casey123** username. \
**NOTE** -- You can see this in the subscription tab we ran in Step. 1 after you submit a post --
**Keep note of the post_id output (copy it)**
```
mutation {
  addPost(
    username: "Casey123"
    topic: "Vlogging"
    body: "https://www.youtube.com/c/Caseyneistatofficial"
    comments: "FIRST COMMENT, Very good videos!"
  ){
    post_id
  }
}
```
&nbsp;
##### 3. To an additional comment to an existing post, you must know the post_id. 
We will use the post id from the earlier mutation that we copied, as the post_id entry for this query \
**NOTE** -- You can see this in the subscription tab we ran in Step. 1 after you submit a comment --
```
mutation {
  addComment(
	post_id: "<paste the post_id here>"
    username: "John345"
    body: "Really enjoying the daily uploads!"
  ){
    post_id
    comment_id
    responses
    username
    body
  }
}
```
&nbsp;
##### 4. To add a response to a comment (NOT WORKING but the following would be intended mutation)
Using the comment id from the earlier mutation, we can update it with a new response!
```
mutation {
  addReponse(
    comment_id: "<comment_id>"
    responses: "Same! I always look forward to the upcoming episode!"
  ){
    comment_id
  }
}
```


### Sample Queries
Now we can query the database with the following.

#### List of Users
```
query {
  users {
    user_id
    username
    name
  }
}
```

#### Get all available Posts
```
query {
  posts {
    post_id
    username
    topic
    body
  }
}
```
#### Posts by Topic
You can replace the "Vlogging", with any topics you are searching for, in this case we inputted a post regarding Vlogging so we are sorting by that
```
query{
  getPostByTopic(topic:"Vlogging"){
    post_id
    topic
    body
    username
    comments
  }
}
```
#### Posts by ID
Be sure to input a valid post_id, if you forgot the one you had when inputting a post, you can refer to a query above **Get all available Posts** to find a valid post_id
```
query{
  getPostById(post_id: "ecaaac7d28baec92c2c9"){
    post_id
    topic
    username
    body
    comments
  }
}
```