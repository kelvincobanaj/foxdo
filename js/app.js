/**
 * Foxdo
 * @author Kelvin Çobanaj
 */

var config = new IDBStore({
	storeName: 'config',
	storePrefix: 'foxdo-',
	dbVersion: 1,
	keyPath: 'id',
	autoIncrement: true,
	indexes: [],
	onStoreReady: function () {
		config.get(0, function (data) {
			if (!data) {
				config.put({ id: 0, tutorial: true }, function () {
					$$('article ul').append(
						'<li><a href="#"><p data-id="-1"><label class="pack-checkbox"><input type="checkbox"><span></span></label>Swipe right to remove a task</p></a></li>'					
					);
				});
			}
		});
	},
	onError: function (error) { alert('Some thing went wrong \n Error:', error) }
});

var db = new IDBStore({
	storeName: 'tasks',
	storePrefix: 'foxdo-',
	dbVersion: 1,
	keyPath: 'id',
	autoIncrement: true,
	indexes: [],
	onStoreReady: function () {
		db.getAll(function (tasks) {
			$$.each(tasks, function (index, field) {
				var state = '';
				(field.completed === true) ? state = 'checked' : '';
				$$('article ul').append(
					'<li><a href="#"><p data-id="'+ field.id +'"><label class="pack-checkbox"><input type="checkbox"'+ state +'><span></span></label>'+ field.task +'</p></a></li>'
				);
			});
		});

		$$('menu a').tap(function () {
			var input = prompt('What do you have to do?');
			if (input) {
				db.put({ task: input, completed: false }, function (id) {
					$$('article ul').append(
						'<li class="fadeInLeft"><a href="#"><p data-id="'+ id +'"><label class="pack-checkbox"><input type="checkbox"><span></span></label>'+ input +'</p></a></li>'
					);
				});
			}
		});

		$$('article li').swipeRight(function () {
			if (confirm('Delete task?')) {
				var task = $$(this);
				db.remove(parseFloat(task.children().children().data('id')), function () {
					task.addClass('fadeOutRight');
					setTimeout(function () {
						task.remove();
					}, 1000);
				});
			}
		});

		$$('article ul').on('change', 'input[type="checkbox"]', function () {
			var task = $$(this).parent().parent();
			var completed = (this.checked) ? true : false;
			db.put({
				id: parseFloat(task.data('id')),
				task: task.text(),
				completed: completed
			});
		});
	},
	onError: function (error) { alert('Some thing went wrong \n Error:', error) }
});