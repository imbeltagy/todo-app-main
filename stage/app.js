// Switch Theme
document.getElementById("switch-theme").onclick = function () {
  [this.src, this.dataset.altSrc] = [this.dataset.altSrc, this.src];
  document.body.classList.toggle("light");
};

// Create Tasks
const tasks = [];
function createTask(isChecked, content) {
  const task = {
    checked: isChecked,
    content: content,
  };
  tasks.push(task);

  // Append To Tasks Field
  const taskElement = document.createElement("div");
  taskElement.className = isChecked ? "task checked" : "task";
  taskElement.role = `Task number ${tasks.length + 1}`;

  const checkBtn = document.createElement("span");
  checkBtn.className = "check-btn";
  checkBtn.role = "Check the task Button";
  checkBtn.onclick = function () {
    this.parentElement.classList.toggle("checked");
    if (task.checked == true) {
      task.checked = false;
    } else {
      task.checked = true;
    }
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
  removeBtn.onclick = function () {
    this.parentElement.remove();
    tasks.splice(tasks.indexOf(task), 1);
  };

  taskElement.append(checkBtn, taskContent, removeBtn);

  document.querySelector(".tasks-field").appendChild(taskElement);
}

const inputField = document.querySelector(".input-field");
inputField.querySelector("span").onclick = () => {
  createTask(false, inputField.querySelector("input").value);
  inputField.querySelector("input").value = "";
};
