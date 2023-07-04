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
  task.remove();
  tasks.splice(tasks.indexOf(task), 1);
  countChecked();
}

// Create Tasks
const tasks = [];
function createTask(isChecked, content) {
  // Append To Tasks Field
  const taskElement = document.createElement("div");
  taskElement.className = isChecked ? "task checked" : "task";
  taskElement.role = `Task`;
  taskElement.draggable = true;

  const checkBtn = document.createElement("span");
  checkBtn.className = "check-btn";
  checkBtn.role = "Check the task Button";
  checkBtn.onclick = function () {
    this.parentElement.classList.toggle("checked");
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

  tasks.push(taskElement);
  document.getElementById("tasks").appendChild(taskElement);
  countChecked();

  // Drag Event
  let overd = null; // when the mouse is over another task
  taskElement.addEventListener("drag", (e) => {
    if (tasks.length > 1 && document.getElementById("tasks").classList.contains("all-tasks")) {
      // If The Mouse Over Any Task
      tasks.forEach((t) => {
        if (e.y >= t.offsetTop && e.y < t.offsetTop + t.offsetHeight) {
          overd = t;
        }
      });

      // If The Mouse Height The First Task
      const firstTask = tasks[0];
      if (e.y < firstTask.offsetTop && e.y) {
        overd = "top";
      }

      // If The Mouse Lower The Last Task
      const lastTask = tasks[tasks.length - 1];
      if (e.y > lastTask.offsetTop + lastTask.offsetHeight) {
        overd = "bottom";
      }

      // Move The Task
      let taskIndex = tasks.indexOf(taskElement);
      if (overd == "top") {
        if (firstTask != taskElement) {
          // Replace Task In DOM
          taskElement.remove();
          firstTask.insertAdjacentElement("beforeBegin", taskElement);

          // Replace Task In Arrays
          moveArrEle(tasks, taskIndex, -1);
        }
      } else if (overd == "bottom") {
        if (lastTask != taskElement) {
          // Replace Task In DOM
          taskElement.remove();
          lastTask.insertAdjacentElement("afterEnd", taskElement);

          // Replace Task In Arrays
          moveArrEle(tasks, taskIndex, tasks.length - 1);
        }
      } else if (overd != taskElement && overd != tasks[tasks.indexOf(taskElement) - 1] && overd != null) {
        // Replace Task In DOM
        taskElement.remove();
        overd.insertAdjacentElement("afterEnd", taskElement);

        // Replace Task In Arrays
        moveArrEle(tasks, taskIndex, tasks.indexOf(overd));
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

for (let i = 1; i < 7; i++) {
  createTask(false, i);
}

// Info Section
// -- Count Checked Tasks
function countChecked() {
  let count = 0;
  tasks.forEach((task) => {
    if (task.classList.contains("checked")) {
      count++;
    }
    document.getElementById("unchecked-count").innerText = tasks.length - count;
  });
}
// -- Clear Completed Tasks
document.getElementById("clear").onclick = () => {
  tasks.forEach((task) => {
    if (task.classList.contains("checked")) {
      removeTask(task);
    }
  });
};
// -- Filter Tasks
const filters = Array.from(document.getElementById("filters").children);
filters.forEach((filter) => {
  filter.onclick = () => {
    filters.forEach((f) => {
      f.classList.remove("checked");
      document.getElementById("tasks").classList.remove(`${f.classList[0]}-tasks`);
    });
    filter.classList.add("checked");
    document.getElementById("tasks").classList.add(`${filter.classList[0]}-tasks`);
  };
});
