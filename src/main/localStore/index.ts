import store from 'electron-store';

export const localStore = new store({
	name: 'config',
});
