package com.cub.webrtc.controller;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class FileUploadController {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Value("${cub.upload.filepath}")
    private String filepath;

    @PostMapping(value = "/uploadVideo", produces = { "multipart/form-data" })
    public void uploadVideo(@RequestPart("files") MultipartFile multipartfile, @RequestPart("contract") String contract) {

        String fileName = multipartfile.getOriginalFilename();

        Timestamp ts = new Timestamp(System.currentTimeMillis());
        DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd-HHmmssS");
        String timeStamp = sdf.format(ts);

        File file = new File(filepath + timeStamp + "_" + contract + "_" + fileName + ".webm");

        if (!file.exists()) {

            logger.info("開始產生影像檔案");
            try (BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(file))) {

                byte[] data = multipartfile.getBytes();
                bos.write(data);
                bos.flush();
                logger.info("產生影像檔案成功");
            } catch (IOException e) {
                e.printStackTrace();
            }

        }

    }

    @PostMapping(value = "/uploadSignature", produces = { "multipart/form-data" })
    public void uploadSignature(@RequestPart("signature") String signature, @RequestPart("contract") String contract) {

        Timestamp ts = new Timestamp(System.currentTimeMillis());
        DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd-HHmmssS");
        String timeStamp = sdf.format(ts);

        logger.info("開始產生簽名檔案");
        try (BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(new File(filepath + timeStamp + ".png")))) {

            byte[] decoderBytes = Base64.getDecoder().decode(signature);

            bos.write(decoderBytes);
            bos.flush();
            logger.info("產生簽名檔案成功");

        } catch (IOException e) {
            e.printStackTrace();
        }

    }

}
