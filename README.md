# task


This is a react application that visualizes the environmental data through charts. It helps  the user to view data in different time intervals like daily weekly monthly and yearly.Here the random data is sumbitted to the server and stored in mongodb database and these datas are fetched and displayed as  charts  for visualization.

For the application several packages  are used they are :

for front-end :
1) React 
2) Tailwindcss -for styling 
3) chartjs -for displaying datas in graphical  form
4) Axios  -for making the request to  the server
5) date-fns -for date maanipulations

for the  backend:
1) Nodejs
2) Expressjs
3) mongoose
4) bcryptjs -for hashong the password
5) cors - to  enable  CORS-Orgin resourse sharing  
6) nodemon - for  auto restart of the server
7) jsonwebtoken - for JWT  authentication 
8) dotenv - to store  environmental  variables


to run the task :

1) clone the using the git repository link 
2) It contain 2 folders client and server in the task folder  need to run the client and server separately 

3) to  run the client  >>cd  task >> cd client >> cd my-project >> npm run dev   ==> will  get a console that for example  running @ http://localhost:5173   open this link  in the browser as cors is enabled once serevr is also started will be able to get dats and enter datas to database. 

4) to run the server >>cd task >>  cd serevr >> npm run dev (make sure that nodemon is installed).


Once the user sign up and sign in he will be able to enter the datas  to database by clicking the button submit random variables and it is displayed in the screen dashboard.