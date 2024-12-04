import { logout } from "./logout.js";

document.addEventListener("DOMContentLoaded", function () {
  try {
    blockUser();
    changeSpace();
    deleteUser();
    logout();
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
      const res = await fetch(`/api/admin/update/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: true }),
      });
      if (res.status === 200) alert("Użytkownik został zablokowany");
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
      let newSpace = prompt("Podaj nową przestrzeń dla użytkownika (MB)");
      if (!newSpace) return;
      newSpace = parseInt(newSpace);
      if (isNaN(newSpace)) return alert("Podana wartość nie jest liczbą");
      newSpace = newSpace * 1024 * 1024; //? Convert MB to Bytes
      const userId = e.target.closest(".space-btn").dataset.id;
      const res = await fetch(`/api/admin/update/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storageLimit: newSpace }),
      });
      if (res.status === 200) {
        alert("Przestrzeń użytkownika została zmieniona");
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
      const res = await fetch(`api/admin/delete/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 200) {
        alert("Użytkownik został usunięty");
        const userItem = e.target.closest(".user-list-item");
        userItem.remove();
      }
    });
  });
};
