package com.cub.webrtc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class WelcomController {

	@GetMapping("/")
	public String main() {
		return "index";
	}
	
//	@PostMapping("uploadVideo")
//	public void uploadVideo() {
//		
//	}

}
