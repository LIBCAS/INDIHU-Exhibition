package cz.inqool.uas.indihu.controller;

import cz.inqool.uas.indihu.entity.domain.SurveyAnswer;
import cz.inqool.uas.indihu.entity.dto.SurveyAggregationDto;
import cz.inqool.uas.indihu.entity.dto.SurveyAnswerDto;
import cz.inqool.uas.indihu.service.SurveyService;
import io.swagger.annotations.*;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.validation.Valid;
import java.util.List;

/**
 * Controller for managing survey answers
 */
@Api(value = "surveyController", description = "Controller for managing survey answers")
@RestController
@RequestMapping("/api/survey")
public class SurveyController {

    private SurveyService surveyService;

    @ApiOperation(value = "Submits an answer to a survey")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Answer submitted successfully", response = SurveyAnswer.class),
            @ApiResponse(code = 400, message = "Invalid input")
    })
    @RequestMapping(method = RequestMethod.POST, value = "/answer")
    public SurveyAnswer submitAnswer(@ApiParam(value = "Survey answer data", required = true)
                                     @Valid @RequestBody SurveyAnswerDto dto) {
        return surveyService.submitAnswer(dto);
    }

    @ApiOperation(value = "Gets all answers for a survey")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Answers retrieved successfully")
    })
    @RequestMapping(method = RequestMethod.GET, value = "/answers/{expoId}/{screenId}")
    public List<SurveyAnswer> getSurveyAnswers(@ApiParam(value = "Exposition ID", required = true) @PathVariable("expoId") String expoId,
                                               @ApiParam(value = "Screen ID", required = true) @PathVariable("screenId") String screenId) {
        return surveyService.getSurveyAnswers(expoId, screenId);
    }

    @ApiOperation(value = "Deletes all survey answers for a specific exposition and screen")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Survey answers deleted successfully")
    })
    @RequestMapping(method = RequestMethod.DELETE, value = "/{expoId}/{screenId}")
    public void deleteSurveyAnswers(@ApiParam(value = "Exposition ID", required = true) @PathVariable("expoId") String expoId,
                                    @ApiParam(value = "Screen ID", required = true) @PathVariable("screenId") String screenId) {
        surveyService.deleteSurveyAnswers(expoId, screenId);
    }

    @ApiOperation(value = "Gets aggregated survey statistics for a specific exposition and screen")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Aggregated survey data retrieved successfully", response = SurveyAggregationDto.class)
    })
    @RequestMapping(method = RequestMethod.GET, value = "/aggregate/{expoId}/{screenId}")
    public SurveyAggregationDto getAggregatedSurveyData(
            @ApiParam(value = "Exposition ID", required = true) @PathVariable("expoId") String expoId,
            @ApiParam(value = "Screen ID", required = true) @PathVariable("screenId") String screenId,
            @ApiParam(value = "Include free text answers in response", required = false)
            @RequestParam(value = "includeFreeAnswers", required = false, defaultValue = "false") boolean includeFreeAnswers) {
        return surveyService.getAggregatedSurveyData(expoId, screenId, includeFreeAnswers);
    }

    @Inject
    public void setSurveyService(SurveyService surveyService) {
        this.surveyService = surveyService;
    }
}

