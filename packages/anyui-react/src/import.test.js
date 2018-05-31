import {retrieveNpm, dynamicImport} from './import';

describe('dynamic imports', () => {
	it('Should work for umd type modules', done => {
        retrieveNpm('react', '15.4.1', 'dist/react.min.js')
            .then(dynamicImport)
            .then((ReactImported) => {
                expect(ReactImported.version).toBe('15.4.1');
                done();
            });
    });
});