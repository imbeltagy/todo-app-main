// Switch Theme
document.getElementById("switch-theme").onclick = function () {
  [this.src, this.dataset.altSrc] = [this.dataset.altSrc, this.src];
  document.body.classList.toggle("light");
};

// Create Function To Move Elements In Arrays
function moveArrEle(arr, fromIndex, beforeIndex) {
  // afterIndex => the element that will be before the replaced element
  let beforeEle = arr[beforeIndex];
  let ele = arr.splice(fromIndex, 1)[0];
  arr.splice(arr.indexOf(beforeEle) + 1, 0, ele);
}

// Remove Tasks
function removeTask(task) {
  tasks.splice(tasks.indexOf(task), 1);
  if (completed.includes(task)) {
    completed.splice(completed.indexOf(task), 1);
  }
  if (noncompleted.includes(task)) {
    noncompleted.splice(noncompleted.indexOf(task), 1);
  }
  task.remove();
  countChecked();
}

// Create Tasks
const tasks = [],
  completed = [],
  noncompleted = [];
function createTask(isChecked, content) {
  // Append To Tasks Field
  const taskElement = document.createElement("div");
  taskElement.role = `Task`;
  taskElement.draggable = true;
  tasks.push(taskElement);
  if (isChecked) {
    taskElement.className = "task checked";
    completed.push(taskElement);
  } else {
    taskElement.className = "task";
    noncompleted.push(taskElement);
  }

  const checkBtn = document.createElement("span");
  checkBtn.className = "check-btn";
  checkBtn.role = "Check the task Button";
  checkBtn.onclick = function () {
    this.parentElement.classList.toggle("checked");
    if (this.parentElement.classList.contains("checked")) {
      completed.push(taskElement);
      noncompleted.splice(noncompleted.indexOf(taskElement), 1);
    } else {
      noncompleted.push(taskElement);
      completed.splice(completed.indexOf(taskElement), 1);
    }
    countChecked();
  };

  const taskContent = document.createElement("p");
  taskContent.className = "task-content";
  taskContent.textContent = content;

  const removeBtn = document.createElement("img");
  removeBtn.src = "images/icon-cross.svg";
  removeBtn.alt = "X";
  removeBtn.className = "remove-btn";
  removeBtn.title = "Remove Task";
  removeBtn.role = "Remove task";
  removeBtn.onclick = () => {
    removeTask(taskElement);
  };

  taskElement.append(checkBtn, taskContent, removeBtn);

  document.getElementById("tasks").appendChild(taskElement);
  countChecked();

  // Drag Event
  taskElement.addEventListener("drag", (e) => {
    let overd = null; // when the mouse is over another task
    let list = null;
    if (usedFilter == "all") {
      list = tasks;
    } else if (usedFilter == "active") {
      list = noncompleted;
    } else if (usedFilter == "completed") {
      list = completed;
    }

    if (list.length > 1) {
      // If The Mouse Over Any Task
      list.forEach((t) => {
        if (e.y >= t.offsetTop && e.y < t.offsetTop + t.offsetHeight) {
          overd = t;
        }
      });

      // If The Mouse Height The First Task
      const firstTask = list[0];
      if (e.y < firstTask.offsetTop && e.y) {
        overd = "top";
      }

      // If The Mouse Lower The Last Task
      const lastTask = list[list.length - 1];
      if (e.y > lastTask.offsetTop + lastTask.offsetHeight) {
        overd = "bottom";
      }

      // Move The Task
      let taskIndex = list.indexOf(taskElement);
      if (overd == "top") {
        if (firstTask != taskElement) {
          // Replace Task In DOM
          taskElement.remove();
          firstTask.insertAdjacentElement("beforeBegin", taskElement);

          // Replace Task In Arrays
          moveArrEle(list, taskIndex, -1);
        }
      } else if (overd == "bottom") {
        if (lastTask != taskElement) {
          // Replace Task In DOM
          taskElement.remove();
          lastTask.insertAdjacentElement("afterEnd", taskElement);

          // Replace Task In Arrays
          moveArrEle(list, taskIndex, list.length - 1);
        }
      } else if (overd != taskElement && overd != list[list.indexOf(taskElement) - 1] && overd != null) {
        // Replace Task In DOM
        taskElement.remove();
        overd.insertAdjacentElement("afterEnd", taskElement);

        // Replace Task In Arrays
        moveArrEle(list, taskIndex, list.indexOf(overd));
      }
    }
  });
}

// Create Task From Input Field Value
const inputField = document.getElementById("input");
function createTaskFromInputField() {
  createTask(false, inputField.querySelector("input").value);
  inputField.querySelector("input").value = "";
}
inputField.querySelector(".check-btn").onclick = createTaskFromInputField;
inputField.onkeydown = (e) => {
  if (e.key == "Enter") {
    createTaskFromInputField();
  }
};

// Info Section
// -- Count Checked Tasks
function countChecked() {
  document.getElementById("unchecked-count").innerText = noncompleted.length;
}

// -- Clear Completed Tasks
document.getElementById("clear").onclick = () => {
  completed.forEach((task) => {
    tasks.splice(tasks.indexOf(task), 1);
    task.remove();
  });
  completed.length = 0;
};

// -- Filter Tasks
let usedFilter = "all";
const filters = Array.from(document.getElementById("filters").children);
filters.forEach((filter) => {
  filter.onclick = () => {
    // Remove All Filters
    filters.forEach((f) => {
      f.classList.remove("checked");
      document.getElementById("tasks").classList.remove(`${f.classList[0]}-tasks`);
    });

    // Add The Checked Filter
    filter.classList.add("checked");
    document.getElementById("tasks").classList.add(`${filter.classList[0]}-tasks`);
    usedFilter = filter.classList[0];

    // Reorder Tasks
    if (usedFilter == "all") {
      tasks.length = 0;
      tasks.splice(0, 0, ...noncompleted.concat(completed));
      tasks.forEach((task) => {
        task.remove();
        document.getElementById("tasks").append(task);
      });
    }
  };
});
