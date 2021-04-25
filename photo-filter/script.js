//full-screen
const fullScreen = document.documentElement;
const fullScreenId = document.getElementById('fullscreen');

const onFullScreen = () => {
  if (!document.fullscreenElement) {
    fullScreen.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      OffFullScreen();
    }
  }
};

const OffFullscreen = () => {
    document.addEventListener("keypress",(event) => {
        if(event.key == 'Escape'){
            onFullScreen();
        }
    },false);
};

fullScreenId.addEventListener('click', onFullScreen);

//function that works with filters
const image = document.querySelector('.image');
const btnReset = document.querySelector('.btn-reset');
const inputs = document.querySelectorAll('.filters input');

function changeFilter() {

  function changeInputsFilter() {

    const filter = this.dataset.sizing || '';
    image.style.setProperty(`--${this.name}`, this.value + filter);
    const outFilter = this.nextElementSibling;
    outFilter.innerHTML = this.value;
  }

  inputs.forEach(input => input.addEventListener('input', changeInputsFilter));

}

changeFilter();

//function Button Reset
function resetFilters() {
  inputs.forEach(input => {
    (input.name === 'saturate') ? input.value = 100: input.value = 0;
    image.style.setProperty(`--${input.name}`, input.value + (input.dataset.sizing || ''));
    const outFilter = input.nextElementSibling;
    outFilter.innerHTML = input.value;
  });

}

btnReset.addEventListener('click', resetFilters);

// load picture
function loadImage() {
  const fileLoad = document.querySelector('input[type="file"]');
  fileLoad.addEventListener('change', function () {
    const file = fileLoad.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      image.src = reader.result;
    };

    reader.readAsDataURL(file);
    console.log(fileLoad.value);
  });
}

loadImage();

//save Image
function downloadImage() {

  const canvas = document.querySelector('canvas');
  const btnSaveImage = document.querySelector('.btn-save');

  function getFilter() {
    let filters = '';
    let imageFilters = image.style.cssText;

    for (let i = 0; i < imageFilters.length; i++) {
      if (imageFilters[i] === '-' && imageFilters[i - 1] !== 'e') {
        continue;
      } else {
        switch (imageFilters[i]) {
          case ":":
            filters = filters + '(';
            break;
          case ";":
            filters = filters + ')';
            break;
          default:
            filters = filters + imageFilters[i];
            break;
        }
      }
    }
    return filters;
  }

  function createCanvas(img) {
    const canv = canvas.getContext('2d');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canv.filter = getFilter();
    canv.drawImage(img, 0, 0);
  }

  function saveImage() {
    btnSaveImage.addEventListener('click', () => {
      const request = new Promise((resolve, reject) => {
        const img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.src = image.src;
        img.onload = () => {
          createCanvas(img);
          resolve();
        };
      });
      request.then(function createLink() {
        let link = document.createElement('a');
        link.download = 'savedImdage.png';
        link.href = canvas.toDataURL();
        link.click();
        link.delete;
      });
    });
  }
  saveImage();
}
downloadImage();

//function add active class for buttons
function btnActive() {

  const btns = document.querySelectorAll('.btn');

  btns.forEach(btn => btn.addEventListener('click', function () {
    const active = document.getElementsByClassName('btn-active');
    active[0].className = active[0].className.replace(' btn-active', "");
    this.className += ' btn-active';
  }));
}

btnActive();
