<?php
    require "../../../config/mjmConfig.php";

    global $recaptchaVerifyUrl, $recaptchaVerifyKey;
    // prepare booking response array for use as HTTP response
    $bookingResponse = array();
    $bookingResponse["bookingStatus"] = "";
    $bookingResponse["bookingErrMsg"] = "";
    $bookingResponse["bookingName"] = "";
    $bookingResponse["bookingType"] = "";
    $bookingResponse["bookingDate"] = "";
    // prepare quote response array for use as HTTP response
    $quoteResponse = array();
    $quoteResponse["quoteStatus"] = "";
    $quoteResponse["quoteErrMsg"] = "";
    $quoteResponse["quoteName"] = "";
    // prepare contact response array for use as HTTP response
    $contactResponse = array();
    $contactResponse["contactStatus"] = "";
    $contactResponse["contactErrMsg"] = "";
    $contactResponse["contactName"] = "";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {              // check request method used by form
        // get raw data after HTTP headers into data stream
        $requestObj = file_get_contents('php://input');      // get raw booking object into data stream
        $requestJson = json_decode($requestObj);             // convert raw booking object to JSON

        if( !is_null($requestObj) ) {                        // check if posted data is not null
            
            // get form type (booking form | quote form | contact form)
            $formType = $requestJson->formType;
            if($formType == 'booking') {
                 // get booking object properties from JSON-booking form values
                $bookingType = $requestJson->bookingType;
                $date = $requestJson->date;
                $name = $requestJson->name;
                $email = $requestJson->email;
                $phone = $requestJson->phone;
            }

            if($formType == 'quote') {
                $name = $requestJson->name;
                $email = $requestJson->email;
                $phone = $requestJson->phone;
                $requirements = $requestJson->requirements;
            }

            if($formType == 'contact') {
                $name = $requestJson->name;
                $email = $requestJson->email;
                $phone = $requestJson->phone;
                $enquiry = $requestJson->enquiry;
            }

            $recaptchaToken = $requestJson->recaptchaToken; // get recaptchaToken from JSON-Used on all forms
            // make POST call using curl to verify recaptcha from api
            $ch = curl_init();
            curl_setopt_array($ch, [ 
                CURLOPT_URL => $recaptchaVerifyUrl,                                                                  
                CURLOPT_POST => true,                                                                    
                CURLOPT_POSTFIELDS => [
                    "secret" => $recaptchaVerifyKey,
                    "response" => $recaptchaToken,
                    "remoteip" => $_SERVER['REMOTE_ADDR']
                ],
                CURLOPT_RETURNTRANSFER => true
            ]); 
            $postResponse = curl_exec ($ch);
            curl_close($ch);
            $recaptchaVerifyResponse = json_decode($postResponse);

            // process booking form
            if( $formType == 'booking' ) {

                // check recaptcha success message and score
                if(isset($recaptchaVerifyResponse->success) && $recaptchaVerifyResponse->success) {
                    if(isset($recaptchaVerifyResponse->score) && ($recaptchaVerifyResponse->score >= 0.5)) {
            
                        if ( processBookingForm($bookingType, $date, $name, $email, $phone) ) {
                            // send email to mjm admin for booking
                            if( sendAdminBookingEmail ($bookingType, $date, $name, $email, $phone) ) {
                                // also send email to client who made the booking if email provided
                                if( !empty($email) ) {
                                    if ( sendClientBookingEmail ( $bookingType, $date, $name, $email, $phone ) ) {
                                        $bookingResponse["bookingStatus"] = "Success";
                                    } else {
                                        mjmLog("Database Insert Passed but email send to Client failed! BookingInfo=>" . 
                                            "Type: $bookingType; Date: $date; Name: $name; Email: $email; Phone: $phone");
                                    }
                                }
                                $bookingResponse["bookingStatus"] = "Success"; // no client email provided - still success
                                // assign remaining HTTP response values
                                $bookingResponse["bookingName"] = $name;
                                $bookingResponse["bookingType"] = $bookingType;
                                $bookingResponse["bookingDate"] = $date;
                            } else {
                                $bookingResponse["bookingStatus"] = "Fail";
                                $bookingResponse["bookingErrMsg"] = "Error sending email!";
                                $bookingResponse["bookingName"] = $name;
                                $bookingResponse["bookingType"] = $bookingType;
                                $bookingResponse["bookingDate"] = $date;
                                mjmLog("Database Insert Passed but email send to MJM Admin failed! BookingInfo=>" . 
                                    "Type: $bookingType; Date: $date; Name: $name; Email: $email; Phone: $phone");
                            }
                        } else {
                            $bookingResponse["bookingStatus"] = "Fail";
                            $bookingResponse["bookingErrMsg"] = "Error in processing booking data!";
                            $bookingResponse["bookingName"] = $name;
                            $bookingResponse["bookingType"] = $bookingType;
                            $bookingResponse["bookingDate"] = $date;
                            mjmLog("Database Insert Failed! BookingInfo=>" . 
                                "Type: $bookingType; Date: $date; Name: $name; Email: $email; Phone: $phone");
                        }

                    } else { // fail challenge when score is <0.5
                        $bookingResponse["bookingStatus"] = "Fail";
                        $bookingResponse["bookingErrMsg"] = "Google Recaptcha Verification failed! " . 
                            "Are you a robot? If not, please try again.";
                        $bookingResponse["bookingName"] = $name;
                        $bookingResponse["bookingType"] = $bookingType;
                        $bookingResponse["bookingDate"] = $date;
                        mjmLog("Booking Recaptcha Verification Failed-Low score: " . json_encode($recaptchaVerifyResponse,1));
                    }
                } else {
                    $bookingResponse["bookingStatus"] = "Fail";
                    $bookingResponse["bookingErrMsg"] = "Google Recaptcha Verification failed! " . 
                        "Are you a robot? If not, please try again."; 
                    $bookingResponse["bookingName"] = $name;
                    $bookingResponse["bookingType"] = $bookingType;
                    $bookingResponse["bookingDate"] = $date;
                    mjmLog("Booking Recaptcha Verification Failed-No success: " . json_encode($recaptchaVerifyResponse,1));
                }
                
                echo json_encode($bookingResponse);     // encode response array for HTTP response as JSON and write it out

            } // end if(formType == 'booking')

            // process quote form
            if( $formType == 'quote' ) {

                if(isset($recaptchaVerifyResponse->success) && $recaptchaVerifyResponse->success) {
                    if(isset($recaptchaVerifyResponse->score) && ($recaptchaVerifyResponse->score >= 0.5)) {

                        if ( processQuoteForm( $name, $email, $phone, $requirements ) ) {
                            // send email to mjm admin for quote
                            if( sendAdminQuoteEmail ( $name, $email, $phone, $requirements ) ) {
                                // also send email to client who made the quote if email provided
                                if( !empty($email) ) {
                                    if ( sendClientQuoteEmail ( $name, $email, $phone, $requirements ) ) {
                                        $quoteResponse["quoteStatus"] = "Success";
                                    } else {
                                        mjmLog("Ouote Database Insert Passed but email send to Client failed! QuoteInfo=>" . 
                                            "Name: $name; Email: $email; Phone: $phone; $requirements");
                                    }
                                }
                                $quoteResponse["quoteStatus"] = "Success"; // no client email provided - still success
                                $quoteResponse["quoteName"] = $name;
                            } else {
                                $quoteResponse["quoteStatus"] = "Fail";
                                $quoteResponse["quoteErrMsg"] = "Error sending email!";
                                $quoteResponse["quoteName"] = $name;
                                mjmLog("Quote Database Insert Passed but email send to MJM Admin failed! QuoteInfo=>" . 
                                    "Name: $name; Email: $email; Phone: $phone; $requirements");
                            }
                        } else {
                            $quoteResponse["quoteStatus"] = "Fail";
                            $quoteResponse["quoteErrMsg"] = "Error in processing quote data!";
                            $quoteResponse["quoteName"] = $name;
                            mjmLog("Quote Database Insert Failed! QuoteInfo=>" . 
                                "Name: $name; Email: $email; Phone: $phone; $requirements");
                        }
                    } else { // fail challenge when score is <0.5
                        $quoteResponse["quoteStatus"] = "Fail";
                        $quoteResponse["quoteErrMsg"] = "Google Recaptcha Verification failed! " . 
                            "Are you a robot? If not, please try again.";
                        $quoteResponse["quoteName"] = $name;
                        mjmLog("Quote Recaptcha Verification Failed-Low score: " . json_encode($recaptchaVerifyResponse,1));
                    }
                } else {
                    $quoteResponse["quoteStatus"] = "Fail";
                    $quoteResponse["quoteErrMsg"] = "Google Recaptcha Verification failed! " . 
                        "Are you a robot? If not, please try again."; 
                    $quoteResponse["quoteName"] = $name;
                    mjmLog("Quote Recaptcha Verification Failed-No success: " . json_encode($recaptchaVerifyResponse,1));
                }

                echo json_encode($quoteResponse);
            } // end if(formType == 'quote')

            // process contact form
            if( $formType == 'contact' ) {

                if(isset($recaptchaVerifyResponse->success) && $recaptchaVerifyResponse->success) {
                    if(isset($recaptchaVerifyResponse->score) && ($recaptchaVerifyResponse->score >= 0.5)) {

                        if ( processContactForm( $name, $email, $phone, $enquiry ) ) {
                            // send email to mjm admin for contact enquiry
                            if( sendAdminContactEmail ( $name, $email, $phone, $enquiry ) ) {
                                // also send email to client who made the contact enquiry if email provided
                                if( !empty($email) ) {
                                    if ( sendClientEnquiryEmail ( $name, $email, $phone, $enquiry ) ) {
                                        $contactResponse["contactStatus"] = "Success";
                                    } else {
                                        mjmLog("Contact Database Insert Passed but email send to Client failed! ContactInfo=>" . 
                                            "Name: $name; Email: $email; Phone: $phone; $enquiry");
                                    }
                                }
                                $contactResponse["contactStatus"] = "Success"; // no client email provided - still success
                                $contactResponse["contactName"] = $name;
                            } else {
                                $contactResponse["contactStatus"] = "Fail";
                                $contactResponse["contactErrMsg"] = "Error sending email!";
                                $contactResponse["contactName"] = $name;
                                mjmLog("Contact Database Insert Passed but email send to MJM Admin failed! ContactInfo=>" . 
                                    "Name: $name; Email: $email; Phone: $phone; $enquiry");
                            }
                        } else {
                            $contactResponse["contactStatus"] = "Fail";
                            $contactResponse["contactErrMsg"] = "Error in processing contact enquiry data!";
                            $contactResponse["contactName"] = $name;
                            mjmLog("Contact Database Insert Failed! ContactInfo=>" . 
                                "Name: $name; Email: $email; Phone: $phone; $enquiry");
                        }
                    } else { // fail challenge when score is <0.5
                        $contactResponse["contactStatus"] = "Fail";
                        $contactResponse["contactErrMsg"] = "Google Recaptcha Verification failed! " . 
                            "Are you a robot? If not, please try again.";
                        $contactResponse["contactName"] = $name;
                        mjmLog("Contact Recaptcha Verification Failed-Low score: " . json_encode($recaptchaVerifyResponse,1));
                    }
                } else {
                    $contactResponse["contactStatus"] = "Fail";
                    $contactResponse["contactErrMsg"] = "Google Recaptcha Verification failed! " . 
                        "Are you a robot? If not, please try again."; 
                    $contactResponse["contactName"] = $name;
                    mjmLog("Contact Recaptcha Verification Failed-No success: " . json_encode($recaptchaVerifyResponse,1));
                }

                echo json_encode($contactResponse);
            } // end if(formType == 'contact')

        } else {
            mjmLog("Request Object from Observable UI is NULL!");
        }

    } else {
        mjmLog("Request Method on call to api is NOT POST");
    }

?>