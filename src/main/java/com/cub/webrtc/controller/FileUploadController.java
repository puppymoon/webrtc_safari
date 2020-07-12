package com.cub.webrtc.controller;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class FileUploadController {

	@PostMapping(value = "/uploadVideo", produces = { "multipart/form-data" })
	public void uploadVideo(@RequestPart("files") MultipartFile multipartfile,
			@RequestPart("contract") String contract) {

		String fileName = multipartfile.getOriginalFilename();

		Timestamp ts = new Timestamp(System.currentTimeMillis());
		DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd-HHmmssS");
		String timeStamp = sdf.format(ts);

		File file = new File("/Users/moontea/Documents/workspace/springboot/video/" + timeStamp + "_" + contract + "_"
				+ fileName + ".webm");

		if (!file.exists()) {

			try (BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(file))) {

				byte[] data = multipartfile.getBytes();
				bos.write(data);
				bos.flush();

			} catch (IOException e) {
				e.printStackTrace();
			}

		}

	}

}
