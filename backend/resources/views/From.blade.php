<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Student Form</title>
</head>
<body>
    
  <h2>Student Information Form</h2>
  <form action="/submit" method="POST">
    <label for="studentName">Student Name:</label><br>
    <input type="text" id="studentName" name="studentName" required><br><br>

    <label for="familyName">Family Name:</label><br>
    <input type="text" id="familyName" name="familyName" required><br><br>

    <label for="number">Number:</label><br>
    <input type="number" id="number" name="number" required><br><br>

    <button type="submit">Submit</button>
  </form>
</body>
</html>

