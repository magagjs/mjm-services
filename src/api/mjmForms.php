<?php
    require "../../../config/mjmConfig.php";

    global $recaptchaVerifyUrl, $recaptchaVerifyKey;
    $bookingResponse = array();                             // prepare booking response array for use as HTTP response
    $bookingResponse["bookingStatus"] = "";
    $bookingResponse["bookingErrMsg"] = "";
    $bookingResponse["bookingName"] = "";
    $bookingResponse["bookingType"] = "";
    $bookingResponse["bookingDate"] = "";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {              // check request method used by form
        // get raw data after HTTP headers into data stream
        $bookingModelObj = file_get_contents('php://input'); // get raw booking object into data stream
        $bookingModelJson = json_decode($bookingModelObj);   // convert raw booking object to JSON

        if( !is_null($bookingModelObj) ) {                   // check if posted data is not null          
            // get booking object properties from JSON - these are form values
            $bookingType = $bookingModelJson->bookingType;
            $date = $bookingModelJson->date;
            $name = $bookingModelJson->name;
            $email = $bookingModelJson->email;
            $phone = $bookingModelJson->phone;
            $recaptchaToken = $bookingModelJson->recaptchaToken;
            
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

            // check recaptcha success message and score
            if(isset($recaptchaVerifyResponse->success) && $recaptchaVerifyResponse->success) {
                if(isset($recaptchaVerifyResponse->score) && ($recaptchaVerifyResponse->score >= 0.5)) {
        
                    // storage
                    if ( processBookingForm($bookingType, $date, $name, $email, $phone) ) {
                        // send email to mjm admin for booking
                        if( sendAdminBookingEmail ($bookingType, $date, $name, $email, $phone) ) {
                            // also send email to client who made the booking if email provided
                            if( !empty($email) ) {
                                if ( sendClientBookingEmail ( $bookingType, $date, $name, $email, $phone ) ) {
                                    $bookingResponse["bookingStatus"] = "Success";
                                }else {
                                    mjmLog("Database Insert Passed but email send to Client failed! BookingInfo=>" . 
                                        "Type: $bookingType; Date: $date; Name: $name; Email: $email; Phone: $phone");
                                }
                            }
                            $bookingResponse["bookingStatus"] = "Success"; // no client email provided - still success
                        }else {
                            $bookingResponse["bookingStatus"] = "Fail";
                            $bookingResponse["bookingErrMsg"] = "Error sending email!";
                            mjmLog("Database Insert Passed but email send to MJM Admin failed! BookingInfo=>" . 
                                "Type: $bookingType; Date: $date; Name: $name; Email: $email; Phone: $phone");
                        }
                    } else {
                        $bookingResponse["bookingStatus"] = "Fail";
                        $bookingResponse["bookingErrMsg"] = "Error in processing booking data!";
                        mjmLog("Database Insert Failed!");
                    }

                }else { // fail challenge when score is <0.5
                    $bookingResponse["bookingStatus"] = "Fail";
                    $bookingResponse["bookingErrMsg"] = "Google Recaptcha Verification failed! " . 
                        "Are you a robot? If not, please try again.";
                    mjmLog("Recaptcha Verification Failed-Low score: " . json_encode($recaptchaVerifyResponse,1));
                }
            } else {
                $bookingResponse["bookingStatus"] = "Fail";
                $bookingResponse["bookingErrMsg"] = "Google Recaptcha Verification failed! " . 
                    "Are you a robot? If not, please try again."; 
                mjmLog("Recaptcha Verification Failed-No success: " . json_encode($recaptchaVerifyResponse,1));
            }

            // assign HTTP response values
            $bookingResponse["bookingName"] = $name;
            $bookingResponse["bookingType"] = $bookingType;
            $bookingResponse["bookingDate"] = $date;

        } else {
            mjmLog("BookingModelObj from Observable UI is NULL!");
            $bookingResponse["bookingStatus"] = "Fail";
            $bookingResponse["bookingErrMsg"] = "Error in processing booking form!";
        }

    } else {
        mjmLog("Request Method on call to api is NOT POST");
        $bookingResponse["bookingStatus"] = "Fail";
        $bookingResponse["bookingErrMsg"] = "Error in processing booking form!";
    }

    echo json_encode($bookingResponse);     // encode response array for HTTP response as JSON and write it out
?>