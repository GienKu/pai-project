document.addEventListener("DOMContentLoaded", function () {
  try {
    blockUser();
    changeSpace();
    deleteUser();
  } catch (err) {
    console.error(err);
  }
});

//! Block User
const blockUser = () => {
  const blockBtn = document.querySelectorAll(".block-btn");
  if (!blockBtn || blockBtn.length <= 0) return;
  blockBtn.forEach((btn) => {
    const newButton = btn.cloneNode(true);
    btn.replaceWith(newButton);
    newButton.addEventListener("click", async (e) => {
      const confirmed = confirm("Chcesz zablokować użytkownika?");
      if (!confirmed) return;
      const userId = e.target.dataset.id;
      const res = await fetch(`/admin/block/${userId}`, {
        method: "UPDATE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.status === "success") {
        location.reload();
      }
    });
  });
};

//! Change Space
const changeSpace = () => {
  const spaceBtn = document.querySelectorAll(".space-btn");
  if (!spaceBtn || spaceBtn.length <= 0) return;
  spaceBtn.forEach((btn) => {
    const newButton = btn.cloneNode(true);
    btn.replaceWith(newButton);
    newButton.addEventListener("click", async (e) => {
      //TODO : change space - add modal to confirm
      return;
      const userId = e.target.dataset.id;
      const newSpace = e.target.dataset.space;
      const res = await fetch(`/admin/space/${userId}`, {
        method: "UPDATE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ space: newSpace }),
      });
      const data = await res.json();
      if (data.status === "success") {
        location.reload();
      }
    });
  });
};

//! Delete User
const deleteUser = () => {
  const deleteBtn = document.querySelectorAll(".delete-btn");
  if (!deleteBtn || deleteBtn.length <= 0) return;
  deleteBtn.forEach((btn) => {
    const newButton = btn.cloneNode(true);
    btn.replaceWith(newButton);
    newButton.addEventListener("click", async (e) => {
      const confirmed = confirm("Chcesz usunąć użytkownika?");
      if (!confirmed) return;
      const userId = e.target.dataset.id;
      const res = await fetch(`/admin/delete/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.status === "success") {
        location.reload();
      }
    });
  });
};
