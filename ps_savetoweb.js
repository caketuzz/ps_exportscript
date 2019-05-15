<javascriptresource>
<name>$$$/JavaScripts/Emmanuel Steinitz/Menu=Export for web</name>
<category>Scripts</category>
</javascriptresource>
// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop

//// Internal Options - To be modified for other configurations ////
var suffix = "web"; //// could be "big"
var jpegQuality = 12; // quality of the exported jpeg
var webResizeLongSide = 1200; // longest side for resize for web
var webResizeUnitValue = "px"; // Unit value for web resize
var signature = "Emmanuel Steinitz"; // name of the layer for watermark/signature

// ok and cancel button
var okButtonID = 1;
var cancelButtonID = 2;

settingDialog();


function settingDialog() {

    var dlgMain = new Window("dialog", "flavor");
    dlgMain.flavour = dlgMain.add("edittext", undefined, "");
    dlgMain.flavour.alignment = 'fill';
    
    // Button OK
    dlgMain.btnOk = dlgMain.add("button", undefined, "OK");
    dlgMain.btnOk.onClick = function() {
		saveFlavour(dlgMain.flavour.text)
		dlgMain.close(okButtonID); 
	}
    
    //  Button Cancel
    dlgMain.btnCancel = dlgMain.add("button", undefined, "Cancel");
    dlgMain.btnCancel.onClick = function() {
		dlgMain.close(cancelButtonID); 
	}
	
	dlgMain.flavour.active = true;
	dlgMain.show()
}

function saveFlavour(flavour){
	// Get document name
	var doc = app.activeDocument;
	var segments = doc.name.split(".");
	segments.splice(segments.length-1, 1); 
	var docName = segments.join("");
	
	// Save History state before altering stuff
	var savedHistoryState = doc.activeHistoryState;
	
	// Turn On Signature on Web export
	var wasSignatureVisible = false;
	var signatureLayer = null;
	if (suffix === "web"){
	
		// Resize Image
		if(doc.height > doc.width){
      		doc.resizeImage(undefined, UnitValue(webResizeLongSide, webResizeUnitValue), 300, ResampleMethod.BICUBIC);
			//doc.resizeCanvas(new UnitValue(2400,'px'),new UnitValue(3000,'px'), AnchorPosition.MIDDLECENTER);
		}else{
			doc.resizeImage(UnitValue(webResizeLongSide, webResizeUnitValue), undefined, 300, ResampleMethod.BICUBIC);
      		//doc.resizeCanvas(new UnitValue(3000,'px'),new UnitValue(2400,'px'), AnchorPosition.MIDDLECENTER);
     	}
     	
		var layers = app.activeDocument.layers;
		var len = layers.length;
		var match = false;
		// iterate through layers to find a match for watermark
		if (len >1)
		for (var i = 0; i < len; i++) {
			// test for matching layer
			var layer = layers[i];
			if (layer.name.toLowerCase() == signature.toLowerCase()) {
				// select matching layer
				signatureLayer = layer;
				match = true;
				break;
			}
		}
		if (match){
			wasSignatureVisible = signatureLayer.visible 
			signatureLayer.visible = true
		}
		
	}

	// Save to new JPEG
	jpgFile = new File( app.activeDocument.fullName.parent+"/"+docName+"_"+flavour+"_"+suffix+".jpeg" )
	jpgSaveOptions = new JPEGSaveOptions()
	jpgSaveOptions.embedColorProfile = true
	jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE
	jpgSaveOptions.matte = MatteType.NONE
	jpgSaveOptions.quality = jpegQuality
	doc.saveAs(jpgFile, jpgSaveOptions, true,Extension.LOWERCASE)

	if (signatureLayer!= null){
		signatureLayer.visible = wasSignatureVisible;
	}
	
	// Restore History state
	doc.activeHistoryState =  savedHistoryState
}