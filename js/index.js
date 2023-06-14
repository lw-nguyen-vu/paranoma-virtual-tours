var viewer;
var startX;
var startY;

const delta = 6;
const panoramaImages = [
  'https://www.picturecorrect.com/wp-content/uploads/2015/04/panorama-tips.jpg',
  'https://photographylife.com/wp-content/uploads/2010/05/Yosemite-Panorama.jpg',
  'https://cdn.tgdd.vn/hoi-dap/906425/chup-anh-panorama-toan-canh-tren-camera-cua-smar%201-800x400.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Panorama_of_the_courtyard_of_the_Great_Mosque_of_Kairouan.jpg/1200px-Panorama_of_the_courtyard_of_the_Great_Mosque_of_Kairouan.jpg',
  'https://cdn.tgdd.vn/hoi-dap/906425/chup-anh-panorama-toan-canh-tren-camera-cua-smar%202-800x450.jpg',
  'https://expertphotography.b-cdn.net/wp-content/uploads/2021/08/aspect.ratio_.mishra.panorama.jpg',
  'https://cdn.tgdd.vn/hoi-dap/906425/chup-anh-panorama-toan-canh-tren-camera-cua-smar%204-800x400.jpg',
  'https://glamptrip.vn/wp-content/uploads/2022/12/1669861131083-1024x682.jpeg',
  'https://s3.envato.com/files/261065298/DSC_2650_20181026%20Panorama.jpg',
  'https://file.hstatic.net/200000054702/file/image3_7579c4f20ca640a290bbab4bc7278401_master.png',
  'https://www.widsmob.com/wp-content/uploads/2018/02/panorama-definition.jpg',
  'https://photographylife.com/wp-content/uploads/2010/04/20100415-Dead-Horse-Point-040.jpg',
  'https://static4.depositphotos.com/1003352/382/i/950/depositphotos_3826575-stock-photo-mountain-lake.jpg',
  'https://vir.com.vn/stores/news_dataimages/hung/052016/07/09/3_crop.jpg',
  'https://bcp.cdnchinhphu.vn/334894974524682240/2022/5/6/1-1651803453578534047508.jpg',
  'https://blogchamchi.com/wp-content/uploads/2023/05/Su-khac-nhau-giua-anh-360-do-anh-Panorama-va-anh-thuong-e1684251331802-750x375.jpg',
  'https://arena.fpt.edu.vn/wp-content/uploads/2021/05/partial-panorama.jpg',
  'https://allimages.sgp1.digitaloceanspaces.com/photographereduvn/2022/04/Hinh-nen-may-tinh-dep-nhat-the-gioi-Full-HD.jpg',
  'https://cdn.tgdd.vn/Files/2016/04/23/819804/anhpanorama3.jpg',
  'https://c4.wallpaperflare.com/wallpaper/688/446/433/digital-digital-art-artwork-illustration-photography-hd-wallpaper-preview.jpg',
  'https://i.pinimg.com/originals/36/19/1b/36191bf9917397000a200a8601047d1d.jpg',
  'https://images8.alphacoders.com/853/thumb-1920-853722.jpg',
  'https://images.fpt.shop/unsafe/filters:quality(90)/fptshop.com.vn/uploads/images/tin-tuc/21083/Originals/panorama-2.jpg',
  'https://i.pinimg.com/originals/27/8f/e4/278fe4e77497122172ea5294626f77aa.jpg',
  'https://minhtuanmobile.com/uploads/blog/hinh-nen-dien-thoai-thien-nhien-tuyet-sac-4k-230317122913.jpg',
  'https://cdn.wallpapersafari.com/95/38/yqsLMO.jpg',
  'https://a-static.besthdwallpaper.com/outdoors-fantasy-city-drawing-wallpaper-2880x1080-110571_89.jpg',
  'https://images.pexels.com/photos/207385/pexels-photo-207385.jpeg?cs\u003dsrgb\u0026dl\u003dpexels-pixabay-207385.jpg\u0026fm\u003djpg',
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
      },

      scenes: {
        firstScene: {
          hfov: 220,
          pitch: -3,
          yaw: 117,
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
        // Click!
        const location = viewer.mouseEventToCoords(event);

        const imageSrc = getRandomPanoramaUrl();

        const newSceneId =
          'room' +
          (
            Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
          ).toUpperCase();

        const newHotSpot = {
          pitch: location[0],
          yaw: location[1],
          type: 'scene',
          text: newSceneId,
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
        // viewer.loadScene(
        //   newSceneId,
        //   viewer.getPitch(),
        //   viewer.getYaw(),
        //   viewer.getHfov()
        // );
      }
    });
  }
}

document
  .getElementById('panoramaInput')
  .addEventListener('change', handleFileUpload);
