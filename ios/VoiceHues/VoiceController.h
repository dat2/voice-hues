//
//  VoiceController.h
//  VoiceHues
//
//  Created by Nicholas Dujay on 11/06/2016.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <OpenEars/OELanguageModelGenerator.h>
#import <OpenEars/OEAcousticModel.h>
#import <OpenEars/OEEventsObserver.h>

#import "RCTBridgeModule.h"
#import "RCTEventDispatcher.h"

@interface VoiceController : NSObject <RCTBridgeModule, OEEventsObserverDelegate> {
  NSString *_lmPath;
  NSString *_dicPath;
  BOOL _listening;
}
@property (strong, nonatomic) OEEventsObserver *openEarsEventsObserver;

- (NSError *)createLanguageModel: (NSArray *)phrases;
- (void) _stopListening;
- (void)_startListening;
@end