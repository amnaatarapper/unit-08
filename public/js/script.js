validateForm = () => {
    var title = document.getElementById('title').value;
    var author = document.getElementById('author').value;

    if (title == "") {
      alert("Name must be filled out");
      return false;
    }

    if (author == "") {
        alert("Author must be filled out");
        return false;
    }
}

validateUpdateForm = () => {
  var title = document.getElementById('title').value;
  var author = document.getElementById('author').value;

  if (title == "") {
    alert("Name must be filled out");
    return false;
  }

  if (author == "") {
      alert("Author must be filled out");
      return false;
  }

  if (title != "" && author != "" ) {
    return confirm('Do you really want to update this book?');
  }
}




