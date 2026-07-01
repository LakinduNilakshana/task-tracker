const list = document.getElementById("list");
const form = document.getElementById("form");
const titleInput = document.getElementById("title");
const submitBtn = document.getElementById("submit-btn");

function formatWhen(createdAt) {
  if (!createdAt) return "";
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

async function loadTasks() {
  try {
    const res = await fetch("/api/tasks");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const tasks = await res.json();
    if (!Array.isArray(tasks)) {
      throw new Error("Unexpected response format");
    }
    list.innerHTML = "";
    if (!tasks.length) {
      list.innerHTML = '<li class="empty">No tasks yet. Add one above.</li>';
      return;
    }
    for (const t of tasks) {
      const li = document.createElement("li");
      li.className = "task-item";

      const titleEl = document.createElement("p");
      titleEl.className = "task-title";
      titleEl.textContent = t.title;

      const metaEl = document.createElement("p");
      metaEl.className = "task-meta";
      metaEl.textContent = formatWhen(t.created_at) || "Just added";

      li.append(titleEl, metaEl);
      list.appendChild(li);
    }
  } catch (error) {
    list.innerHTML = '<li class="empty error">Error loading tasks. Please try again.</li>';
    console.error(error);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  if (!title) return;
  submitBtn.disabled = true;
  try {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    titleInput.value = "";
    await loadTasks();
  } catch (err) {
    list.innerHTML = '<li class="empty error">Could not add task. Try again.</li>';
    console.error(err);
  } finally {
    submitBtn.disabled = false;
    titleInput.focus();
  }
});

loadTasks();
