package com.cub.webrtc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WelcomController {

    //網頁進入點
	@GetMapping("/")
	public String main() {
		return "index";
	}

}
