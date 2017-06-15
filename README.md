You need to have nodejs and npm installed already. 

Setup up mongodb first and start
-Once you install mongo and change the environment variables, you can run mongo from the command line
-to run the database, 
    -mongod --dbpath (add the path you want to use, for example, I'm using "C:\Users\dsand_000\Documents\GitHub\Projects\calendar\data")
    -or 
    -mongod (if the default path is already created)       
        -open another cmd window and and navigate to the diego-db folder
            -now you need to add a database "calendar" and insert test collections we have setup from the diego-db folder (import-command.text)
            -there is a list of commands to do that from the terminal window
            -here, you should be able to use those commands to insert the test collections 

From the calendar project folder, now you can run npm install to make sure all the dependencies are installed

Then run npm start and it should start the server on port 3000 of the localhost

(authentication was done using only username, since we couldn't ge that working with the passport module)