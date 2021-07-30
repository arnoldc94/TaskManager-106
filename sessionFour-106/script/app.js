let detailsVisible = true;
let important = false;
let tasks = [];
var serverUrl = "https://fsdiapi.azurewebsites.net/";//server url

function toggleImportant() {
    if(important) {
        $("#iImportant").removeClass('fas').addClass('far');
        important = false;
    }
    else{
        $("#iImportant").removeClass('far').addClass('fas');
        important = true;
    }
}

function categoryChanged() {
    let selVal = $("#selCategory").val();

    if(selVal === "7"){
        $("#txtCategory").removeClass('hide');
    }
    else{
        $("#txtCategory").addClass('hide');
    }
    console.log(selVal);
}

function toggleDetails() {
    if(detailsVisible) {
        $("#capture-form").hide();
        detailsVisible = false;
    }
    else{
        $("#capture-form").show();
        detailsVisible = true;    
    }
}


function saveTask(){
    console.log("Saving Task");

    let title = $("#txtTitle").val();
    let description = $("#txtDescription").val();
    let location = $("#txtLocation").val();
    let dueDate = $("#selDueDate").val();
    let category = $("#selCategory").val();
    if(category === "7") category = $("#txtCategory").val();
    let color = $("#selColor").val();

    let task = new Task( title, important, description, location, dueDate, category, color, _id);
    console.log(task);

    $.ajax({
        type: "POST",
        url: serverUrl + "api/tasks/",
        data: JSON.stringify(task),
        contentType: "application/json",

        success: function(response) {
            console.log("server says: ", response);
            let responseTasks = JSON.parse(response);
            displayTask(responseTasks);
        },
        error: function(error) {
            console.log("Error saving: ", error);
        }
    });

}

function fetchTask(){
    // create a get request to
    //url: serverUrl + "api/tasks/",

    $.ajax({
        type: "GET",
        url: serverUrl + "api/tasks",
        
        success: function(response) {
            tasks = JSON.parse(response);
            // filter tasks by name
            for(let i=0; i<tasks.length; i++){
               let task = tasks[i];
               if(task.name === "coreyCH20"){
                 displayTask(task);
               }
            }
        },
        error: function(err) {
            console.log("Error getting data", err);
        }

    })

}


function displayTask(task) {

    let syntax = 
    `<div class ="task" id ="${task._id}"> 
        <i class = 'important fas fa-star'></i>
        <div class = "description">
            <h5>${task.title} </h3>
            <p>${task.description}</p>
        </div>
        <label class = "location">${task.location}</label>
        <label class = "due-date">${task.dueDate}</label>
        <button class = "btn btn-sm btn-dark " onclick="markDone('${task._id}')">Done</button>
        <button id="delete" class = "btn btn-sm btn-danger" onclick="deleteTask('${task._id}')">Delete</button>
    </div>`;
    
    if(task.status === "Done") {
        $("#doneTasks").append(syntax);
        $("#doneH4").removeClass('hide');
       
    }else {
       $("#pendingTasks").append(syntax); 
       $("#pendingH4").removeClass('hide'); 
    }

}

function markDone(id){
    console.log("Clicked on the done button", id);
    //remove the task from the screen
    $("#" + id).remove();
    
    // get object from tasks
    // that contains the id
    for(let i=0; i < tasks.length; i++) {
        let item = tasks[i];
        if(item._id === id) {
            item.status = "Done";
    
            $.ajax ({
                type: "PUT",
                url: serverUrl + "api/tasks",
                data: JSON.stringify(item),
                contentType: "application/json",
                success: function(response) {
                    console.log("Put results", response);
                    let updatedTask = JSON.parse(response);
                    displayTask(updatedTask);
                },
                error(err) {
                    console.log("Error updating", err);
                },
            });
        }
    }
}

function deleteTask(id) {
    console.log("Deleted task", id);

    $("#" + id).remove();
    
}



function init(){
    console.log("Task manager")

    //load prev data
    fetchTask();
    //hook events
    $("#selCategory").change(categoryChanged);
    $("#btnDetails").click(toggleDetails);
    $("#iImportant").click(toggleImportant);
    $("#saveBtn").click(saveTask);
}

window.onload = init;


// ajax equest(jquery ajax with configuration object)
function testRequest() {
    $.ajax({
        type: 'GET',
        url: "https://restclass.azurewebsites.net/api/test",
        success: function (result) {
            console.log("Response from server", result);
        },
        error: function(errorDetails) {
            console.log("Error calling server", errorDetails);
        }
    });
}