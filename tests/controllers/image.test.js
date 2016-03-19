// With this code, we define a number of global variables as 
// spies, stubs, or empty placeholder JavaScript objects
var proxyquire = require('proxyquire'),    
	callback = sinon.spy(),    
	sidebarStub = sinon.stub(),    
	fsStub = {},    
	pathStub = {},    
	md5Stub = {},    
	ModelsStub = {        
		Image: {            
			findOne: sinon.spy()        
		},        
		Comment: {            
			find: sinon.spy()        
		}    
	},  
	//  Once our stubs are prepared, proxyquire is called to 
	// include our image controller and ensuring that the required 
	// modules within the image controller are actually replaced 
	// with various stubs and spies
	image = proxyquire('../../controllers/image', {        
		'../helpers/sidebar': sidebarStub,        
		'../models': ModelsStub,        
		'fs': fsStub,        
		'path': pathStub,        
		'md5': md5Stub    
	}),    
	res = {},    
	req = {},    
	testImage = {};

describe('Image Controller', function(){    
	beforeEach(function() {        
		res = {            
			render: sinon.spy(),            
			json: sinon.spy(),            
			redirect: sinon.spy()        
		};        
		req.params = {            
			image_id: 'testing'        
		};        
		testImage = {           
			_id: 1,            
			title: 'Test Image',            
			views: 0,           
			likes: 0,            
			save: sinon.spy()        
		};    
	});    
	// Finally, we create a test image object that will be used 
	// by our fake mongoose image model stub to emulate a database 
	// object being returned from MongoDB
	describe('Index', function(){  
		//  Ensure that the index function actually exists
		it('should be defined', function(){        
			expect(image.index).to.be.defined;    
		});    
		// Within the index function, the very first action 
		// that occurs is that the image model is found via the 
		// Models.Image.findOne function. In order to test that 
		// function, we need to first set it as spy. The reason 
		// we do this here and not in beforeEach is because we might 
		// want the findOne method to behave slightly differently in each 
		// test, so we don't want to set a strict rule to be applied for all the tests
		it('should call Models.Image.findOne', function(){        
			ModelsStub.Image.findOne = sinon.spy();
			// In order to emulate that a GET call was posted to our server 
			// and our image index controller function was hit, we can just fire 
			// the function manually. We do this using image.index(req, res) and 
			// pass in our fake request and response objects (defined earlier as 
			// globals and stubbed in the beforeEach function). 
			image.index(req, res);  
			// Since ModelsStub.Image.findOne is a spy, we can test that it 
			// was called, and then separately test that it was called specifically 
			// with the parameters we expect it to be called with
			expect(ModelsStub.Image.findOne).to.be.called;    
		});    
		it('should find Image by parameter id', function(){        
			ModelsStub.Image.findOne = sinon.spy();        
			image.index(req, res);        
			expect(ModelsStub.Image.findOne).to.be.calledWith( 
					{ filename: { $regex: 'testing' } }, sinon.match.func);
		});    
		// to do: write more tests... 
	});
	
	// The last set of tests tests the code that executes when an image is found 
	// and returned from the findOne function
	describe('with found image model', function() {
		// The findOne is no longer a spy in these tests, but a stub that 
		// will manually fire the callback function that's provided as its 
		// second parameter. The callback function that's fired will 
		// include our test image model.  With this stub, we are emulating 
		// that the database call was in fact made via findOne and that a 
		// valid image model was returned. Then, we can test the remainder 
		// of the code that executes within that main callback. 
		beforeEach(function(){        
			ModelsStub.Image.findOne = sinon.stub().callsArgWith(1,null,testImage);    
		});    
		it('should incremement views by 1 and save', function(){        
			image.index(req, res);        
			expect(testImage.views).to.equal(1);        
			expect(testImage.save).to.be.called;    
		});    
		it('should find related comments', function(){        
			image.index(req, res);        
			expect(ModelsStub.Comment.find).to.be.calledWith(
					{image_id: 1}, {}, { sort: { 'timestamp': 1 }}, sinon.match.func);    
		});
		// Once sidebarStub does its job, we expect res.render to have been 
		// called, and we specify the exact parameters we expect it to have been called with
		it('should execute sidebar', function(){        
			ModelsStub.Comment.find = sinon.stub().callsArgWith(
					3, null, [1,2,3]); image.index(req, res);        
			expect(sidebarStub).to.be.calledWith(
					{image: testImage, comments: [1,2,3]},sinon.match.func);    
		});   
		it('should render image template with image and comments', function(){        
			ModelsStub.Comment.find = sinon.stub().callsArgWith(
					3, null, [1,2,3]); sidebarStub.callsArgWith(
							1, {image: testImage, comments: [1,2,3]}); image.index(req, res);        
			expect(res.render).to.be.calledWith(
					'image', {image: testImage, comments: [1,2,3]});    
		});
	}); 
});  