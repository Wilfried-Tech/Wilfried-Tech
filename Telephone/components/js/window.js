class MainWindow extends Interface {
  constructor($interface) {
    super($interface);
    this.mainWindow = this.select('#window');
    this.swiperContainer = this.select('.window-swiper-container');
    this.staticMenu = this.select('.static-window-menu');
    this.pagination = this.select('.pagination');
    this.swiperSlides = [];
    this.paginationBullet = [];
    this.mainIndex = 0;
    this.index = 0;
    this.maxApp = 24;

    this.window = {
      slides: [{
          apps: [
          ['widget_time', 'widget_time', 'widget_time', 'widget_time'],
          ['widget_time', 'widget_time', 'widget_time', 'widget_time'],
          ['widget_search', 'widget_search', 'widget_search', 'widget_search'],
          ['widget_search', 'widget_search', 'widget_search', 'widget_search'],
          ['files', 'whatsapp', 'facebook', 'gallery'],
          ['agenda', 'chrome', 'play_store', 'settings']
          ],
          main: true
    },
        {
          apps: new Array(6).fill(new Array(4).fill('m'))
          }],
      staticMenuApps: ['telephone', 'contacts', 'message', 'camera']
    };
    this.window.slides[1].apps.forEach((row, index) => {
      this.window.slides[1].apps[index] = row.map((t) => {
        var i = rand(0, 76);
        if (i > 38) {
          return ''
        } else {
          return Application.launcherOf(i);
        }
      })
    })
  }
  onBack() {
    if (this.index != this.mainIndex) {
      this.swiperContainer.style.setProperty('--currIndex', `${this.index = this.mainIndex}`);
      this.paginationBullet.forEach(bullet => bullet.classList.remove('active'))
      this.paginationBullet[this.index].classList.add('active');
    }
  }
  buildIconLauncher(appName) {
    var cell = createElement('div', { class: 'menu-cell' })
    if (!/(null|undefined|\W+)/i.test(appName)) {
      var app = createElement('div', { class: 'app' }),
        launcher = createElement('div', { class: 'app-launcher-icon' }, null, [createElement('img', { title: appName, src: Application.launcherOf(appName) })]),
        title = createElement('div', { class: 'app-title', text: appName.replace(/\_/g, ' ') })
      app.appendChild(launcher);
      app.appendChild(title);
      cell.appendChild(app);
      app.addEventListener('click', (e) => {
        Android.launchApplication(appName);
      })
    }
    return cell;
  }
  buildStaticMenu() {
    var grid = createElement('div', { class: 'static-grid' });
    this.staticMenu.appendChild(grid);
    this.window.staticMenuApps.forEach(appName => {
      grid.appendChild(this.buildIconLauncher(appName));
    })
    this.createTemplate(this.window.staticMenuApps, grid)
  }
  createTemplate(struct, container) {
    var apps = [];
    var template = [];
    struct.forEach((row, i) => {
      if (typeof row == 'object') {
        var tempRow = [];
        row.forEach(name => {
          name = `${name}`;
          if (apps.indexOf(name) == -1) {
            apps.push(name);
          } else {
            if (!name.startsWith('widget')) {
              apps.push(name + apps.length);
            }
          }
          tempRow.push(apps[apps.length - 1])
        })
        template.push(tempRow);
      } else {
        row = `${row}`
        if (apps.indexOf(row) == -1) {
          apps.push(row);
        } else {
          if (!row.startsWith('widget')) {
            apps.push(row + apps.length);
          }
        }
        template.push(apps[apps.length - 1])
      }
    })
    var cells = this.select(`.${container.className.split(' ').join('.')}>*`, '*');
    cells.forEach((cell, i) => cell.css('grid-area', apps[i]));
    var string = ''
    template.forEach(row => {
      if (typeof row == 'object') {
        string += `\"${row.join(' ')}\"`;
      } else {
        string += `${row} `;
      }
    })
    if (string[0] != '\"') string = `\"${string}\"`
    container.style.setProperty('grid-template-areas', string);
  }
  buildSwiperMenu() {
    var $this = this;
    this.window.slides.forEach((slides, index) => {
      var cellCount = 0,
        includedWidget = [];
      const slide = createElement('div', { class: 'window-swiper-slides' }),
        grid = createElement('div', { class: 'slides-grid grid-' + index }),
        bullet = createElement('div', { class: 'pagination-bullet' });
      if (slides.main) {
        slide.classList.add('main-slide');
        bullet.classList.add('active');
        this.mainIndex = index;
        this.index = index;
      }
      slides.apps.forEach((row, i) => {
        row.forEach((appName, j) => {
          cellCount++;
          appName = (appName) ? appName : `${appName}null`;
          slides.apps[i][j] = appName;
          if (appName.startsWith('widget') && (includedWidget.indexOf(appName) == -1)) {
            includedWidget.push(appName);
            grid.appendChild(new AndroidUtils.Widget(appName.split('_')[1]).Node);
          } else if (cellCount <= $this.maxApp && !appName.startsWith('widget')) {
            grid.appendChild(this.buildIconLauncher(appName));
          }
        })
      })
      slide.appendChild(grid);
      this.swiperContainer.appendChild(slide);
      this.pagination.appendChild(bullet);
      this.paginationBullet.push(bullet);
      this.swiperSlides.push(slide);
      this.createTemplate(slides.apps, grid);
    })
  }
  swipe(e) {
    var length = this.swiperSlides.length,
      width = phone.offsetWidth,
      dir = 0,
      dx = 0;
    if (e.phase == 'move') {
      dir = (e.direction == 'left') ? -1 : (e.direction == 'right') ? 1 : 0;
      dx = (e.distance <= (width / 3)) ? e.distance * dir : dx;
      this.swiperContainer.style.setProperty('--dx', `${dx}px`);
    }
    if (e.phase == 'end') {
      if (e.distance > (width / 3)) {
        if (e.direction == 'left' && this.index < (length - 1)) {
          this.swiperContainer.style.setProperty('--currIndex', `${++this.index}`);
          this.paginationBullet.forEach(bullet => bullet.classList.remove('active'))
          this.paginationBullet[this.index].classList.add('active')
        }
        if (e.direction == 'right' && this.index > 0) {
          this.swiperContainer.style.setProperty('--currIndex', `${--this.index}`);
          this.paginationBullet.forEach(bullet => bullet.classList.remove('active'))
          this.paginationBullet[this.index].classList.add('active')
        }
      }
      this.swiperContainer.style.setProperty('--dx', '0px');
      dir = 0, dx = 0;
    }
  }
  start() {
    var $this = this;
    this.buildStaticMenu();
    this.buildSwiperMenu();

    this.swiperContainer.css('--swiper-slides-no', `${this.swiperSlides.length}`);
    registerForSwipeEvent(this.swiperContainer);
    this.swiperContainer.addEventListener('swipe', (e) => {
      $this.swipe(e.detail);
    })
    // /*
    // $$('.menu-cell .app').forEAch(cell=>{cell.setAttribute('draggable','true')})
    // $$('.menu-cell img').forEAch(cell=>{cell.setAttribute('draggable','false')})
    // $$('.menu-cell').forEAch(cell=>{cell.setAttribute('dropzone','move')})
    // if */
    ripple(this.select('.app-launcher-icon', '*'));
  }
}

Interface.Window = MainWindow;