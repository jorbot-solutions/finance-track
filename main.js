const electron = require('electron'),
	url = require('url'),
	path = require('path');
	
const {app, BrowserWindow, Menu, ipcMain} = electron;

// set env
//process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

//listen for app to be readyState
app.on('ready', function(){
	
	// create window
	mainWindow = new BrowserWindow({});
	
	// load html file into window
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'mainWindow.html'), // __dirname is the current directory of the app + mainWindow.html
		protocol: 'file:', // sets protocol of content loading as file
		slashes: true
	}));
	
	// quit app when closed
	mainWindow.on('closed', function(){
		app.quit();
	});
	
	// build menu from template
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	
	// insert menu
	Menu.setApplicationMenu(mainMenu);
	
	//$.getJSON('debit.json');
	
});

// handle create add window
function createAddWindow(){
	
	addWindow = new BrowserWindow({
		width: 300,
		height: 135,
		title: 'Add deposit'
	});
	
	// load html file into window
	addWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'addWindow.html'), // __dirname is the current directory of the app + mainWindow.html
		protocol: 'file:', // sets protocol of content loading as file
		slashes: true
	}));
	
	// garbage collection handle
	addWindow.on('close', function(){
		addWindow = null;
	});
	
}

// handle create withdraw window
function createWithdrawWindow(){
	
	withdrawWindow = new BrowserWindow({
		width: 300,
		height: 135,
		title: 'Withdraw Funds'
	});
	
	// load html file into window
	withdrawWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'withdrawWindow.html'), // __dirname is the current directory of the app + mainWindow.html
		protocol: 'file:', // sets protocol of content loading as file
		slashes: true
	}));
	
	// garbage collection handle
	withdrawWindow.on('close', function(){
		withdrawWindow = null;
	});
	
}

// handle create routing window
function createRoutingWindow(){
	routingWindow = new BrowserWindow({
		width: 300,
		height: 135,
		title: 'Withdraw Funds'
	});
	
	// load html file into window
	routingWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'routingWindow.html'), // __dirname is the current directory of the app + mainWindow.html
		protocol: 'file:', // sets protocol of content loading as file
		slashes: true
	}));
	
	// garbage collection handle
	routingWindow.on('close', function(){
		routingWindow = null;
	});
}

// handle create add credit window
function createCreditWindow(){
	creditWindow = new BrowserWindow({
		width: 500,
		height: 400,
		title: 'Add Credits to your profile'
	});
	
	// load html file into window
	creditWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'creditWindow.html'), // __dirname is the current directory of the app + mainWindow.html
		protocol: 'file:', // sets protocol of content loading as file
		slashes: true
	}));
	
	// garbage collection handle
	creditWindow.on('close', function(){
		creditWindow = null;
	});
}

// catch deposit funds
ipcMain.on('deposit:add', function(e, deposit){
	mainWindow.webContents.send('deposit:add', deposit);
	addWindow.close();
});

// catch withdraw funds
ipcMain.on('withdraw:add', function(e, withdraw){
	mainWindow.webContents.send('withdraw:add', withdraw);
	withdrawWindow.close();
});

// catch add credit
ipcMain.on('credit:add', function(e, credit){
	mainWindow.webContents.send('credit:add', credit);
});

// create menu template
const mainMenuTemplate = [
	{
		label: 'File',
		submenu: [
			{
				label: 'Deposit',
				accelerator: process.platform == 'darwin' ? 'Command+D' : 'Ctrl+D',
				click(){
					createAddWindow();
				}
			},
			{
				label: 'Withdraw',
				accelerator: process.platform == 'darwin' ? 'Command+W' : 'Ctrl+W',
				click(){
					createWithdrawWindow();
				}
			},
			{
				label: 'Add Credit',
				accelerator: process.platform == 'darwin' ? 'Command+W' : 'Ctrl+T',
				click(){
					createCreditWindow();
				}
			},
			{
				label: 'Store Routing Number',
				accelerator: process.platform == 'darwin' ? 'Command+N' : 'Ctrl+N',
				click(){
					createRoutingWindow();
				}
			},
			{
				label: 'Clear Items',
				click(){
					mainWindow.webContents.send('deposit:clear');
				}
			},
			{
				label: 'Quit',
				accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
				click(){
					app.quit();
				}
			}
		]
	}
];

// if mac, add empty object to menu
if(process.platform == 'darwin'){
	mainMenuTemplate.unshift({}); // un-shift adds object to beginning of array
}

// add developer tools if not in production
if(process.env.NODE_ENV !== 'production'){
	mainMenuTemplate.push({
		label: 'Developer Tools',
		submenu: [
			{
				label: 'Toggle DevTools',
				accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
				click(item, focusedWindow){
					focusedWindow.toggleDevTools();
				}
			},
			{
				role: 'reload'
			}
		]
	});
}