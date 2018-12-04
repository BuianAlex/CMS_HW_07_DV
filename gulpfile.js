var gulp = require('gulp'), // Подключаем Gulp
	sass = require('gulp-sass'), //Подключаем Sass пакет,
	browserSync = require('browser-sync'), // Подключаем Browser Sync
	concat = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
	uglify = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
	cssnano = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
	rename = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
	del = require('del'), // Подключаем библиотеку для удаления файлов и папок
	babel = require('gulp-babel'),
	cache = require('gulp-cache'), // Подключаем библиотеку кеширования
	autoprefixer = require('gulp-autoprefixer'),// Подключаем библиотеку для автоматического добавления префиксов
	rigger = require('gulp-rigger'),
	imagemin = require('gulp-imagemin');


const createBrowserSync  = function(cd){
	browserSync({ // Выполняем browserSync
		server: { // Определяем параметры сервера
			baseDir: 'app' // Директория для сервера - app
		},
		notify: false // Отключаем уведомления
	});
	cd();
}



const createCss = function (cd) {
	gulp.src('app/sass/**/*.scss') // Берем источник
		.pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
		.pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
		.pipe(browserSync.reload({ stream: true })) // Обновляем CSS на странице при изменении
	cd();
}

const minCss = function (cd) {
	gulp.src('app/css/main.css') // Выбираем файл для минификации
		.pipe(cssnano()) // Сжимаем
		.pipe(rename({ suffix: '.min' })) // Добавляем суффикс .min
		.pipe(gulp.dest('app/css/')); // Выгружаем в папку app/css
		cd();
};


const createLibsCss = gulp.series(createCss,function (cd) {
	gulp.src('app/css/libs.css', { allowEmpty: true }) // Выбираем файл для минификации
		.pipe(cssnano()) // Сжимаем
		.pipe(rename({ suffix: '.min' })) // Добавляем суффикс .min
		.pipe(gulp.dest('app/css/')); // Выгружаем в папку app/css
	cd();
});

//use if exist js libs
const libScripts = function (cd) {
	gulp.src([ // Берем все необходимые библиотеки
		'app/js/libs/jquery-3.3.1.min.js',
		'app/js/libs/popper.min.js',
		'app/js/libs/bootstrap.min.js',
	], { allowEmpty: true })
		.pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
		.pipe(uglify()) // Сжимаем JS файл
		.pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
	cd();
}
const reload = function (cd) {
	browserSync.reload();
	cd(); reload
	
}

const watch = gulp.series(createCss, minCss, libScripts, createBrowserSync, function (cd) {
	gulp.watch('app/sass/**/*.scss', createCss); // Наблюдение за sass файлами в папке sass
	gulp.watch('app/*.html', reload); // Наблюдение за HTML файлами в корне проекта
	gulp.watch('app/js/**/*.js', reload);   // Наблюдение за JS файлами в папке js
	cd();
});



const cleanDist = function (cd) {
	del.sync('dist'); // Удаляем папку dist перед сборкой
	cd();
};

gulp.task('build', gulp.series(cleanDist, createCss, createLibsCss, function (cd) {
			var buildCss = gulp.src([ // Переносим библиотеки в продакшен
				'app/css/*',
			])
				.pipe(gulp.dest('dist/css'))

			var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
				.pipe(gulp.dest('dist/fonts'))

			var buildJs = gulp.src('app/js/**/*')
				.pipe(babel({
					presets: ['@babel/env']
				})) // Переносим скрипты в продакшен
				.pipe(gulp.dest('dist/js'))

			var buildHtml = gulp.src('app/*.html')// Переносим HTML в продакшен
				.pipe(rigger()) //собираем кумки html
				.pipe(gulp.dest('dist'));

			var imagMin = gulp.src('app/img/*')
				.pipe(imagemin())
				.pipe(gulp.dest('dist/img'));
			cd();
		}));



exports.default = watch;

