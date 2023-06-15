var viewer;
var startX;
var startY;

var pitch = 0;
var yaw = 0;

const delta = 6;
const menu = document.getElementById('contextMenu');

// https://www.pexels.com/search/panorama/
const panoramaImages = [
  'https://images.pexels.com/photos/346286/panorama-miami-florida-water-346286.jpeg',
  'https://images.pexels.com/photos/358482/pexels-photo-358482.jpeg',
  'https://images.pexels.com/photos/127753/pexels-photo-127753.jpeg',
  'https://images.pexels.com/photos/1154503/pexels-photo-1154503.jpeg',
  'https://images.pexels.com/photos/144352/pexels-photo-144352.jpeg',
  'https://images.pexels.com/photos/457937/pexels-photo-457937.jpeg',
  'https://images.pexels.com/photos/1619854/pexels-photo-1619854.jpeg',
  'https://images.pexels.com/photos/145525/pexels-photo-145525.jpeg',
  'https://images.pexels.com/photos/87374/pexels-photo-87374.jpeg',
  'https://images.pexels.com/photos/206353/pexels-photo-206353.jpeg',
  'https://images.pexels.com/photos/737551/pexels-photo-737551.jpeg',
  'https://images.pexels.com/photos/266145/pexels-photo-266145.jpeg',
];

function getRandomPanoramaUrl() {
  const randomIndex = Math.floor(Math.random() * panoramaImages.length);
  return panoramaImages[randomIndex];
}

function handleFileUpload(event) {
  const file = event.target.files[0];

  const imageSrc = URL.createObjectURL(file);

  if (viewer === undefined) {
    viewer = pannellum.viewer('panorama', {
      default: {
        firstScene: 'firstScene',
        disableKeyboardCtrl: true,
      },

      scenes: {
        firstScene: {
          autoLoad: true,
          type: 'equirectangular',
          panorama: imageSrc,
        },
      },
    });

    viewer.on('mousedown', (event) => {
      startX = event.pageX;
      startY = event.pageY;
    });
    viewer.on('mouseup', (event) => {
      const diffX = Math.abs(event.pageX - startX);
      const diffY = Math.abs(event.pageY - startY);

      if (diffX < delta && diffY < delta) {
        const location = viewer.mouseEventToCoords(event);
        [pitch, yaw] = location;
      }
    });
  }
}

document
  .getElementById('panoramaInput')
  .addEventListener('change', handleFileUpload);

function addHotSpotInfo(text, pitch, yaw) {
  const newHotSpot = {
    pitch,
    yaw,
    type: 'info',
    text,
  };

  viewer.addHotSpot(newHotSpot);
}

function addHotSpotScene(text, pitch, yaw) {
  const imageSrc = getRandomPanoramaUrl();
  const newSceneId = 'scene' + '#' + Math.random().toString(36).slice(-6);
  const newHotSpot = {
    pitch,
    yaw,
    type: 'scene',
    text,
    sceneId: newSceneId,
  };

  viewer.addHotSpot(newHotSpot);

  const newScene = {
    type: 'equirectangular',
    panorama: imageSrc,
    hotSpots: [
      {
        pitch: 0,
        yaw: 0,
        type: 'scene',
        text: 'Go to First Scene',
        sceneId: 'firstScene',
      },
    ],
  };

  viewer.addScene(newSceneId, newScene);
}

window.addEventListener('contextmenu', (e) => e.preventDefault());

window.addEventListener('mousedown', function (e) {
  if (e.button === 2) {
    var menu = document.getElementById('contextMenu');
    menu.style.display = 'block';
    menu.style.left = e.pageX + 'px';
    menu.style.top = e.pageY + 'px';
  }
});

window.addEventListener('click', function (e) {
  var menu = document.getElementById('contextMenu');
  var inputContainer = document.getElementById('inputContainer');

  if (!menu.contains(e.target) && !inputContainer.contains(e.target)) {
    menu.style.display = 'none';
    hideInput();
  }
});

function handleOptionClick(option) {
  hideInput();
  var inputContainer = document.getElementById('inputContainer');
  inputContainer.classList.remove('hidden');
  inputContainer.dataset.option = option;
}

function hideInput() {
  var inputContainer = document.getElementById('inputContainer');
  inputContainer.classList.add('hidden');
  inputContainer.dataset.option = '';
}

function handleOK() {
  var inputContainer = document.getElementById('inputContainer');
  var option = Number(inputContainer.dataset.option);
  var inputText = document.getElementById('inputText').value.toString();

  document.getElementById('inputText').value = '';

  switch (option) {
    case 1:
      addHotSpotInfo(inputText, pitch, yaw);
      break;
    case 2:
      addHotSpotScene(inputText, pitch, yaw);
      break;
  }

  menu.style.display = 'none';
  hideInput();
}
