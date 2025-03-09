import { Injectable } from '@angular/core';
import { SmsParser } from 'src/app/sms-parser';
import { SMSRetrievalService } from 'src/app/sms-processing/services/sms-retrieval.service';
import { SMSParserPatterns } from '../../sms-paterns';

@Injectable()
export class AdminService {

  public smsParser: SmsParser = new SmsParser(SMSParserPatterns);
  
  constructor(public sms: SMSRetrievalService) { }
}
