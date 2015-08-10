function init(){
  var hash = document.location.hash.substr(1);
  var notes = JSON.parse(decodeURIComponent(hash));
  var ul = document.getElementById('frameworks');
  notes.forEach(function(note) {
    var li = document.createElement('li');
    li.textContent = note.name;
    if (note.guid) {
      var d = new Date(note.created);
      var dh = d.getFullYear() + '/' +  (d.getMonth()+1) + '/' + d.getDate()
      var version = document.createElement('a');
      version.textContent = note.title + " " + dh;
      version.href = "https://www.evernote.com/Home.action#n="+note.guid+"&ses=4&sh=2&sds=5&";
      version.target = "_blank";
      li.appendChild(version);
    }
    ul.appendChild(li);
  });
}
document.addEventListener('DOMContentLoaded', init, false);
