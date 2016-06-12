//
//  VoiceController.m
//  VoiceHues
//
//  Created by Nicholas Dujay on 11/06/2016.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "VoiceController.h"
#import "RCTConvert.h"

#import <OpenEars/OEPocketsphinxController.h>
#import <OpenEars/OEAcousticModel.h>

@implementation VoiceController

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(initialize) {
  self.openEarsEventsObserver = [[OEEventsObserver alloc] init];
  [self.openEarsEventsObserver setDelegate:self];
}

RCT_EXPORT_METHOD(setPhrases: (NSArray *)phrases) {
  [self createLanguageModel:phrases];
}

RCT_EXPORT_METHOD(startListening) {
  if(_listening) {
    [self _stopListening];
  }
  [self _startListening];
}

RCT_EXPORT_METHOD(stopListening) {
  [self _stopListening];
}

/*
 Promise
 
 RCT_REMAP_METHOD(findEvents,
 resolver:(RCTPromiseResolveBlock)resolve
 rejecter:(RCTPromiseRejectBlock)reject)
 {
 NSArray *events = ...
 if (events) {
 resolve(events);
 } else {
 NSError *error = ...
 reject(@"no_events", @"There were no events", error);
 }
 }
 */

- (NSError *)createLanguageModel: (NSArray *)phrases {
  OELanguageModelGenerator *lmGenerator = [[OELanguageModelGenerator alloc] init];
  
//  NSArray *words = [NSArray arrayWithObjects:@"WORD", @"STATEMENT", @"OTHER WORD", @"A PHRASE", nil];
  NSString *name = @"VoiceHuesLanguageModel.lm";
  NSError *err = [lmGenerator generateLanguageModelFromArray:phrases withFilesNamed:name forAcousticModelAtPath:[OEAcousticModel pathToModel:@"AcousticModelEnglish"]];
  // Change "AcousticModelEnglish" to "AcousticModelSpanish" to create a Spanish language model instead of an English one.
  
  if(err == nil) {
    _lmPath = [lmGenerator pathToSuccessfullyGeneratedLanguageModelWithRequestedName:@"VoiceHuesLanguageModel.lm"];
    _dicPath = [lmGenerator pathToSuccessfullyGeneratedDictionaryWithRequestedName:@"VoiceHuesLanguageModel.lm"];
    RCTLogInfo(@"Successfully created a language model at %@", name);
  }
  
  return err;
}

- (void) _startListening {
  [[OEPocketsphinxController sharedInstance] setActive:TRUE error:nil];
  [[OEPocketsphinxController sharedInstance] startListeningWithLanguageModelAtPath:_lmPath dictionaryAtPath:_dicPath acousticModelAtPath:[OEAcousticModel pathToModel:@"AcousticModelEnglish"] languageModelIsJSGF:NO];
  // Change "AcousticModelEnglish" to "AcousticModelSpanish" to perform Spanish recognition instead of English.
  _listening = true;
}

- (void) _stopListening {
  [[OEPocketsphinxController sharedInstance] stopListening];
  [[OEPocketsphinxController sharedInstance] setActive:FALSE error:nil];
  _listening = false;
}

- (void) pocketsphinxDidReceiveHypothesis:(NSString *)hypothesis recognitionScore:(NSString *)recognitionScore utteranceID:(NSString *)utteranceID {
  [self.bridge.eventDispatcher sendAppEventWithName:@"hypothesis" body:@{@"hypothesis":hypothesis, @"score": recognitionScore, @"id": utteranceID}];
}

- (void) pocketsphinxDidStartListening {
  NSLog(@"Pocketsphinx is now listening.");
}

- (void) pocketsphinxDidDetectSpeech {
  [self.bridge.eventDispatcher sendAppEventWithName:@"speechStarted" body:@{}];
}

- (void) pocketsphinxDidDetectFinishedSpeech {
  [self.bridge.eventDispatcher sendAppEventWithName:@"speechFinished" body:@{}];
}

- (void) pocketsphinxDidStopListening {
  NSLog(@"Pocketsphinx has stopped listening.");
}

- (void) pocketsphinxDidSuspendRecognition {
  NSLog(@"Pocketsphinx has suspended recognition.");
}

- (void) pocketsphinxDidResumeRecognition {
  NSLog(@"Pocketsphinx has resumed recognition.");
}

- (void) pocketsphinxDidChangeLanguageModelToFile:(NSString *)newLanguageModelPathAsString andDictionary:(NSString *)newDictionaryPathAsString {
  NSLog(@"Pocketsphinx is now using the following language model: \n%@ and the following dictionary: %@",newLanguageModelPathAsString,newDictionaryPathAsString);
}

- (void) pocketSphinxContinuousSetupDidFailWithReason:(NSString *)reasonForFailure {
  NSLog(@"Listening setup wasn't successful and returned the failure reason: %@", reasonForFailure);
}

- (void) pocketSphinxContinuousTeardownDidFailWithReason:(NSString *)reasonForFailure {
  NSLog(@"Listening teardown wasn't successful and returned the failure reason: %@", reasonForFailure);
}

- (void) testRecognitionCompleted {
  NSLog(@"A test file that was submitted for recognition is now complete.");
}

@end