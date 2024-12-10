package com.project.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.project.user.service.ScoreDO;

public interface ScoreMapper {
	
	List<ScoreDO> listScore();

	List<ScoreDO> listCharacterScore(@Param("id") String id, @Param("character") String character);
	
	ScoreDO getScore(@Param("id") String id);	

	ScoreDO getCharacterScore(@Param("id") String id, @Param("character") String character);
	
	void insertScore(ScoreDO scoreDO);
	
	void updateScore(ScoreDO scoreDO);
	
	void deleteScore(@Param("id") String id);

}
